import { useState } from "react";
import { ChevronRight, ChevronLeft, Moon, Sun, RotateCcw, Info, CheckCircle, Zap, Target, Users, TrendingUp, BarChart2, AlertTriangle, BookOpen, GitBranch, Lightbulb, Copy, ChevronDown, HelpCircle } from "lucide-react";


// ─── JARGON GLOSSARY ─────────────────────────────────────────────────────────
const GLOSSARY = {
  "dependent variable": "The outcome you are measuring — the thing you expect to change. Also called DV or outcome variable.\n\nExample: If you study whether stress affects sleep, sleep is the dependent variable.",
  "independent variable": "The variable you think causes or predicts the outcome. Also called IV or predictor.\n\nExample: If you study whether stress affects sleep, stress is the independent variable.",
  "parametric": "A statistical test that assumes your data follows a normal (bell-shaped) distribution. Generally more powerful but stricter about data requirements.\n\nExamples: t-test, ANOVA, Pearson r.",
  "non-parametric": "A statistical test that makes NO assumptions about the shape of your data. Safer when data is skewed or when you have small samples.\n\nExamples: Mann-Whitney, Kruskal-Wallis, Spearman.",
  "normality": "Whether your data follows a bell-shaped (normal) curve. Checked using Shapiro-Wilk test, Q-Q plot, or histogram. Many statistical tests assume this.",
  "CLT": "Central Limit Theorem — if your sample is large enough (n>30), the average of your data will be roughly normal even if the raw scores are not. This means parametric tests can work with larger samples even when data looks slightly skewed.",
  "p-value": "The probability of getting your result by chance alone. p < .05 means less than 5% chance your result is due to luck — this is the standard cutoff in psychology.",
  "effect size": "How big or meaningful your finding actually is. A p-value only tells you IF an effect exists — effect size tells you if it MATTERS. Always report both.",
  "post-hoc": "Follow-up tests run after ANOVA when you have 3+ groups. ANOVA tells you 'at least one group differs' — post-hoc tests tell you WHICH specific groups differ.\n\nCommon ones: Tukey HSD, Bonferroni.",
  "homoscedasticity": "A technical term meaning that the spread (variance) of your data is roughly equal across groups. Checked using Levene's test in SPSS.",
  "sphericity": "An assumption specific to Repeated Measures ANOVA. It means the differences between all pairs of time points have similar variance. Checked with Mauchly's test in SPSS.",
  "bootstrapping": "A technique that re-samples your data thousands of times to estimate confidence intervals. Used in mediation analysis. More reliable than traditional methods for indirect effects.",
  "monotonic": "A relationship where as one variable increases, the other consistently increases or decreases — but not necessarily at a constant rate. Spearman detects monotonic relationships.",
  "multicollinearity": "When two or more predictor variables in a regression are highly correlated with each other. Makes it hard to tell which predictor is doing the work. Checked using VIF values — VIF > 10 is a problem.",
  "odds ratio": "Used in logistic regression. An OR of 2.0 means the ODDS of the outcome are twice as high — NOT that it is twice as likely. Important distinction for rare outcomes.",
  "continuous": "Data that can take any numeric value including decimals. Examples: height, weight, test scores, reaction time.",
  "ordinal": "Data with a meaningful order but unequal gaps between values. Example: Likert scales (Strongly Disagree to Strongly Agree).",
  "binary": "Data with exactly two categories. Examples: Yes/No, Pass/Fail, Diagnosed/Not Diagnosed.",
  "categorical": "Data that falls into distinct groups with no natural order. Examples: nationality, type of therapy, faculty/department.",
  "between-subjects": "Each participant is in only one group — measured once. Also called independent samples.",
  "within-subjects": "The same participants are measured more than once — across time points or conditions. Also called repeated measures or paired design.",
  "residuals": "The difference between what your model predicted and what you actually observed. Normality in t-tests and ANOVA applies to residuals — checked AFTER running the model.",
  "VIF": "Variance Inflation Factor — a number that tells you how much multicollinearity is affecting a predictor in regression. VIF > 10 indicates a serious problem.",
  "APA style": "The reporting format required by the American Psychological Association. Used in most psychology dissertations worldwide. Specifies exactly how to report statistics.",
  "cronbach alpha": "A measure of internal consistency — how well all items on a questionnaire measure the same thing. Report before your main analysis. α > .70 is generally acceptable.",
  "type I error": "Rejecting the null hypothesis when it is actually true — a false positive. Probability equals your alpha level (usually .05).",
  "type II error": "Failing to reject the null hypothesis when it is actually false — a false negative. Reduced by increasing sample size.",
  "statistical power": "The probability that your test will detect a real effect if one exists. Aim for .80 (80%) minimum.",
  "null hypothesis": "The default assumption that there is no effect or relationship. Your statistical test evaluates whether the data provides enough evidence to reject it.",
  "confidence interval": "A range of values within which the true population value likely falls (usually 95% CI). Wider intervals mean more uncertainty.",
  "mediation": "When a third variable (M) explains the relationship between X and Y. Example: Stress → Sleep Problems → Poor Grades.",
  "moderation": "When a third variable (W) changes the strength or direction of the relationship between X and Y. Example: The effect of stress on grades may be stronger for students with low social support.",
};

const TIPS = {
  continuous:"Numeric, any value in a range — e.g. score, reaction time, age, percentage.",
  ordinal:"Ordered categories, unequal intervals — e.g. Likert 1–5. Always treated as non-parametric.",
  categorical:"Distinct, unordered groups — e.g. nationality, condition.",
  binary:"Exactly two values — yes/no, pass/fail.",
  "independent samples":"Different participants in each group — each person is only measured once (between-subjects).",
  "paired samples":"The same participants measured at two time points — e.g. before and after an intervention.",
  "repeated measures":"The same participants measured three or more times across different conditions or time points.",
  normality:"Whether your data follows a bell-shaped curve. Checked using Shapiro-Wilk test, Q-Q plot, or histogram. For t-tests/ANOVA, normality applies to the residuals — checked AFTER running the model.",
  mediation:"A mediator (M) explains the mechanism: X→M→Y. Requires causal ordering grounded in theory — not just data.",
  "composite scale":"Built from multiple items (e.g. PHQ-9, GAD-7). Averaged scores are treated as continuous with n>30 — discuss with your supervisor.",
  "kendall":"Kendall's τ-b is preferred over Spearman when there are many tied ranks or small samples. It is directly interpretable as concordance minus discordance probability.",
  "design_fit":"How well this test matches your stated design. 5 stars = gold standard for this design; 3 stars = appropriate but requires stronger assumptions or is more specialised.",
};
const BC={Parametric:["#ddd6fe","#3730a3"],"Non-Parametric":["#dcfce7","#166534"],Advanced:["#ede9fe","#581c87"]};
const FIT={5:"Excellent fit",4:"Strong fit",3:"Good fit",2:"Adequate fit"};
const FIT_COL={5:"#22c55e",4:"#3b82f6",3:"#f59e0b",2:"#94a3b8"};

const T={
  welch_ttest:{n:"Welch's Independent t-Test",e:"👥",b:"Parametric",fit:5,altKey:"mann_whitney",
    plain:"Compare two separate groups on a numeric score",
    tl:"Compare two independent groups — robust to unequal variances",
    why:"Welch's is the modern default for two independent groups. Unlike Student's t, it doesn't assume equal variances, performing equally well when variances are equal and better when they differ (Field, 2018).",
    ass:["Continuous DV","Approximately normal per group (or n>30 by CLT — check for severe skew)","Independent observations","No assumption of equal variances required"],
    alt:{n:"Mann-Whitney U Test",w:"when normality is violated"},
    eff:"Cohen's d — small≥0.20, medium≥0.50, large≥0.80",
    ex:"Comparing mean anxiety (GAD-7) between a CBT group and a waitlist control.",
    ex_plain:"e.g. Do male and female students differ in average stress scores? Do hostel students score higher on loneliness than day scholars?",
    viz:"Side-by-side box plots; bar chart with mean ± 95% CI",
    spss:"Analyze → Compare Means → Independent-Samples T Test → use 'Equal variances not assumed' row in output",
    jmv:"T-Tests → Independent Samples T-Test (Welch's is the default in jamovi)",
    cnt:"Cannot tell you which variable caused the difference, or whether groups also differ on unmeasured variables.",
    sup:"Supervisors may ask: 'Why Welch's not Student's t?' Answer: Welch's is the modern recommended default — robust to variance inequality with negligible cost when variances are equal.",
    cronbach_note:"If your outcome is a multi-item questionnaire scale, report Cronbach's alpha (α) before this test to confirm reliability (α > .70 acceptable).",
  },
  paired_ttest:{n:"Paired Samples t-Test",e:"🔄",b:"Parametric",fit:5,altKey:"wilcoxon",
    plain:"See if scores changed in the same people over time",
    tl:"Track changes in the same participants over time",
    why:"Analyses difference scores within the same participants — more powerful than an independent t-test by controlling for individual variation.",
    ass:["Continuous DV","Same participants at both time points","Difference scores approximately normal","No significant outliers in differences"],
    alt:{n:"Wilcoxon Signed-Rank Test",w:"when differences are non-normal"},
    eff:"Cohen's d from difference scores",
    ex:"PHQ-9 depression scores before vs. after a 12-week mindfulness programme.",
    ex_plain:"e.g. Did exam anxiety scores decrease after students attended a stress management workshop? Did sleep quality improve after a college wellness programme?",
    viz:"Paired line plot; histogram of difference scores",
    spss:"Analyze → Compare Means → Paired-Samples T Test",
    jmv:"T-Tests → Paired Samples T-Test",
    cnt:"Cannot establish causation — only that scores changed between time points. A control group is needed to rule out time/practice effects.",
    sup:"Report t, df, p, and Cohen's d. Check whether a control group was available — without one, alternative explanations for change cannot be ruled out.",
    cronbach_note:"If your outcome is a multi-item questionnaire scale, report Cronbach's alpha (α) before this test to confirm reliability (α > .70 acceptable).",
  },
  oneway_anova:{n:"One-Way ANOVA",e:"📊",b:"Parametric",fit:4,altKey:"kruskal_wallis",
    plain:"Compare three or more separate groups on a numeric score",
    tl:"Compare three or more independent groups",
    why:"Tests whether at least one group mean differs — protecting against inflated Type I error from multiple t-tests.",
    ass:["Continuous DV","Normality within each group","Homogeneity of variance (Levene's test)","Independent observations"],
    alt:{n:"Kruskal-Wallis Test",w:"when normality or equal variances are violated"},
    eff:"Eta-squared η² — small≥0.01, medium≥0.06, large≥0.14",
    ex:"Comparing wellbeing across lecture, flipped, and problem-based learning groups.",
    ex_plain:"e.g. Do stress levels differ across Arts, Science, and Commerce students? Is satisfaction different across three different teaching formats?",
    viz:"Box plots per group; means plot with 95% CI",
    ph:"Tukey HSD or Bonferroni; Games-Howell if Levene's test is significant",
    spss:"Analyze → Compare Means → One-Way ANOVA → Post Hoc",
    jmv:"ANOVA → One-Way ANOVA",
    cnt:"The omnibus F only tells you at least one group differs — post-hoc tests are required to identify which pairs differ.",
    sup:"Always report the omnibus F, η², and post-hoc results with corrected p-values. Reviewers will ask which groups differed.\n\n⚠️ If you have two independent variables (e.g. treatment × gender), you likely need a two-way factorial ANOVA — consult your supervisor.",
  },
  rm_anova:{n:"Repeated Measures ANOVA",e:"🔁",b:"Parametric",fit:4,altKey:"friedman",
    plain:"Track the same people across three or more time points",
    tl:"Track the same participants across 3+ time points",
    why:"Accounts for within-subject variance to dramatically increase power across 3+ conditions in the same sample.",
    ass:["Continuous DV","Sphericity — Mauchly's test; use Greenhouse-Geisser correction if violated","Approximately normal residuals"],
    alt:{n:"Friedman Test",w:"when sphericity or normality is violated"},
    eff:"Partial η²p or generalised η²G (these are not the same — specify which you report)",
    ex:"Wellbeing at baseline, 3, 6, and 12 months post-intervention.",
    ex_plain:"e.g. Did motivation scores change across the start, middle, and end of semester in the same group of students?",
    viz:"Line chart of means over time with SE bars",
    spss:"Analyze → General Linear Model → Repeated Measures",
    jmv:"ANOVA → Repeated Measures ANOVA",
    cnt:"Cannot establish causation from time alone — maturation, history effects, and attrition are still validity threats.",
    sup:"Report whether Mauchly's test was significant. Specify the correction applied (Greenhouse-Geisser or Huynh-Feldt) and the corrected df. Clarify whether you report partial or generalised η².",
  },
  mann_whitney:{n:"Mann-Whitney U Test",e:"🏅",b:"Non-Parametric",fit:4,altKey:"welch_ttest",
    plain:"Compare two separate groups when data is skewed or not normal",
    tl:"Compare two groups without assuming normality",
    why:"Your data doesn't quite fit the standard mould — Mann-Whitney compares rank distributions between two independent groups; fully distribution-free.",
    ass:["Ordinal or continuous DV","Independent observations","Similar distribution shapes (critical: when shapes differ, Mann-Whitney tests probability of superiority, not medians)"],
    alt:{n:"Welch's Independent t-Test",w:"when normality and approximately equal variances are met"},
    eff:"Rank-biserial r — small≥0.10, medium≥0.30, large≥0.50",
    ex:"Comparing Likert-scale job satisfaction (1–7) between two departments.",
    viz:"Box plots with median highlighted; violin plots",
    spss:"Analyze → Nonparametric Tests → Legacy Dialogs → 2 Independent Samples",
    jmv:"T-Tests → Independent Samples T-Test → check Mann-Whitney U",
    cnt:"When group distributions differ in shape (not just location), Mann-Whitney tests the probability that a randomly chosen observation from Group A exceeds one from Group B — not the median difference. Report medians, not means.",
  },
  wilcoxon:{n:"Wilcoxon Signed-Rank Test",e:"✍️",b:"Non-Parametric",fit:4,altKey:"paired_ttest",
    plain:"Compare the same people at two time points when data is skewed",
    tl:"Paired comparison without normality assumption",
    why:"Your paired data doesn't quite fit the standard mould — Wilcoxon uses ranks of difference scores; no distribution assumed.",
    ass:["Paired observations","Ordinal or continuous DV","Differences can be meaningfully ranked"],
    alt:{n:"Paired Samples t-Test",w:"when differences are normally distributed"},
    eff:"Matched-pairs rank-biserial r",
    ex:"Anxiety ratings (1–10) before and after a relaxation training workshop.",
    viz:"Pre/post median bar chart; dot plot of individual changes",
    spss:"Analyze → Nonparametric Tests → Legacy Dialogs → 2 Related Samples",
    jmv:"T-Tests → Paired Samples T-Test → check Wilcoxon signed rank",
    cnt:"Reports whether the typical change is zero — not the magnitude of change in original measurement units.",
  },
  kruskal_wallis:{n:"Kruskal-Wallis Test",e:"📈",b:"Non-Parametric",fit:4,altKey:"oneway_anova",
    plain:"Compare three or more separate groups when data is skewed",
    tl:"Compare 3+ independent groups without normality",
    why:"Your data doesn't fit the standard mould — Kruskal-Wallis uses rank-based comparisons across 3+ independent groups.",
    ass:["Ordinal or continuous DV","Independent observations","Similar distribution shapes"],
    alt:{n:"One-Way ANOVA",w:"when normality and equal variances are met"},
    eff:"ε² or η² from the H statistic",
    ex:"Self-reported stress across five different occupational groups.",
    viz:"Box plots per group; violin plots",
    ph:"Dunn's test with Bonferroni correction",
    spss:"Analyze → Nonparametric Tests → Legacy Dialogs → K Independent Samples",
    jmv:"ANOVA → One-Way ANOVA → check Kruskal-Wallis",
    cnt:"Post-hoc tests are required to identify which specific groups differ from each other.",
  },
  friedman:{n:"Friedman Test",e:"🌀",b:"Non-Parametric",fit:3,altKey:"rm_anova",
    tl:"Repeated measures without parametric assumptions",
    why:"Your data doesn't fit the standard mould — Friedman uses within-subject ranks across 3+ repeated conditions.",
    ass:["Same participants across all conditions","Ordinal or continuous DV","3+ conditions"],
    alt:{n:"Repeated Measures ANOVA",w:"when sphericity and normality are met"},
    eff:"Kendall's W (0=no agreement, 1=perfect)",
    ex:"Therapists rating CBT, DBT, and ACT effectiveness for shared clients.",
    viz:"Median rank line chart",
    ph:"Wilcoxon tests with Bonferroni correction",
    spss:"Analyze → Nonparametric Tests → Legacy Dialogs → K Related Samples",
    jmv:"ANOVA → Repeated Measures ANOVA → check Friedman",
    cnt:"Shows whether conditions differ in rank order — not the size of change in original measurement units.",
  },
  pearson:{n:"Pearson Correlation (r)",e:"📉",b:"Parametric",fit:5,altKey:"spearman",
    plain:"Measure the relationship between two numeric variables",
    tl:"Measure linear relationship between two continuous variables",
    why:"Both variables are continuous and approximately normally distributed. Pearson r quantifies the strength and direction (−1 to +1) of the linear relationship. Note: bivariate normality is required — check both variables, not just one.",
    ass:["Both variables continuous","Both variables approximately normally distributed (check each separately)","Linear relationship — verify with scatter plot","No significant outliers in either variable"],
    alt:{n:"Spearman's Rank Correlation (ρ)",w:"when either variable is non-normal or ordinal"},
    eff:"r itself — small≥0.10, medium≥0.30, large≥0.50",
    ex:"Correlating weekly exercise hours with WEMWBS wellbeing scores.",
    ex_plain:"e.g. Is there a relationship between hours of social media use and loneliness scores? Does sleep duration relate to exam performance?",
    viz:"Scatter plot with regression line and 95% confidence band",
    spss:"Analyze → Correlate → Bivariate → select Pearson",
    jmv:"Regression → Correlation Matrix → select Pearson's r",
    cnt:"Cannot establish causation. Cannot describe non-linear relationships. A significant r with a tiny effect (e.g. r=0.08, p=.04) may not be practically meaningful.",
    sup:"Check both variables for normality and inspect the scatter plot for linearity and outliers before computing r. Always report r, df, and p.",
  },
  spearman:{n:"Spearman's Rank Correlation (ρ)",e:"🔗",b:"Non-Parametric",fit:4,altKey:"pearson",
    plain:"Measure the relationship between two variables when data is skewed or on rating scales",
    tl:"Robust correlation for non-normal or ordinal data",
    why:"Your data doesn't quite fit the standard mould — Spearman uses ranks, is robust to outliers, and needs no normality.",
    ass:["Ordinal or continuous variables","Monotonic relationship — check scatter plot","No normality required"],
    alt:{n:"Pearson Correlation (r)",w:"when both variables are normally distributed and linearly related"},
    eff:"ρ itself — same benchmarks as Pearson r",
    ex:"Correlating Likert attachment anxiety scores with relationship satisfaction.",
    viz:"Scatter plot with Loess smoother",
    spss:"Analyze → Correlate → Bivariate → select Spearman",
    jmv:"Regression → Correlation Matrix → select Spearman's rho",
    cnt:"Captures monotonic relationships — cannot specify the shape of the association.",
  },
  kendalls_tau:{n:"Kendall's Tau-b (τ-b)",e:"🎯",b:"Non-Parametric",fit:4,altKey:"spearman",
    tl:"Correlation for ordinal data — especially with many tied ranks",
    why:"Both variables are ordinal or ranked. Kendall's τ-b is preferred over Spearman when there are many tied ranks or small samples, and is directly interpretable as concordance minus discordance probability.",
    ass:["Both variables ordinal or ranked","Monotonic relationship — check scatter plot","No normality required","Handles tied ranks well"],
    alt:{n:"Spearman's Rank Correlation (ρ)",w:"when few ties exist and n is large (Spearman is more widely reported in psychology)"},
    eff:"τ-b itself — small≥0.10, medium≥0.30, large≥0.50 (note: τ-b is typically smaller than ρ for the same relationship)",
    ex:"Correlating education level (1=GCSE…5=PhD) with self-reported symptom severity rating.",
    viz:"Scatter plot of ranks; bar chart showing concordant vs. discordant pairs",
    spss:"Analyze → Correlate → Bivariate → select Kendall's tau-b",
    jmv:"Regression → Correlation Matrix → select Kendall's tau-b",
    cnt:"τ-b and Spearman's ρ cannot be compared directly — they use different formulas. For non-square tables, use τ-c instead of τ-b.",
    sup:"If reviewers ask why Kendall's over Spearman: cite the presence of tied ranks. Both are acceptable — be consistent with your field's conventions.",
  },
  point_biserial:{n:"Point-Biserial Correlation",e:"⚡",b:"Parametric",fit:4,altKey:"spearman",
    tl:"Correlation between a continuous and a binary variable",
    why:"Point-biserial correlation is mathematically equivalent to Pearson r when one variable is binary. It quantifies how strongly a continuous variable relates to a dichotomous variable (e.g. diagnosis yes/no).",
    ass:["One continuous variable, one genuinely binary variable (not artificially dichotomised)","Continuous variable approximately normally distributed","Independent observations"],
    alt:{n:"Spearman's Rank Correlation (ρ)",w:"when the continuous variable is non-normal or ordinal"},
    eff:"r_pb itself — same benchmarks as Pearson r (small≥0.10, medium≥0.30, large≥0.50)",
    ex:"Correlating reaction time (ms) with diagnosis status (0=healthy, 1=ADHD).",
    viz:"Box plots of the continuous variable split by binary group; violin plot",
    spss:"Analyze → Correlate → Bivariate → select Pearson (SPSS computes point-biserial as Pearson when one variable is binary)",
    jmv:"Regression → Correlation Matrix → select Pearson's r (same computation)",
    cnt:"If the binary variable was artificially created by splitting a continuous one (e.g. 'high vs. low anxiety'), use the original continuous variable for greater power and less information loss.",
    sup:"Note in your write-up that you used the point-biserial correlation (r_pb), even though SPSS computes it as Pearson r — they are mathematically identical.",
  },
  simple_regression:{n:"Simple Linear Regression",e:"📐",b:"Parametric",fit:4,
    plain:"Predict a numeric outcome using one predictor variable",
    tl:"Predict a continuous outcome from one predictor",
    why:"Estimates the linear relationship between one predictor and a continuous outcome, quantifying change per unit of the predictor. Mathematically equivalent to Pearson r — both yield the same R², F, and p-value for simple regression.",
    ass:["Linear relationship","Normal residuals — verified AFTER running the model with a Q-Q plot (not the raw DV)","Homoscedasticity","Independent observations"],
    alt:{n:"Spearman or non-linear regression",w:"when linearity or residual normality is violated"},
    eff:"R²; Cohen's f² — small≥0.02, medium≥0.15, large≥0.35",
    ex:"Predicting exam performance (%) from total study hours.",
    viz:"Scatter with regression line; residual-vs-fitted plot",
    spss:"Analyze → Regression → Linear (1 IV in 'Independents')",
    jmv:"Regression → Linear Regression",
    cnt:"Cannot prove causation. Normality applies to the residuals, not the raw DV — always check residual plots after running the model.",
    sup:"Note: normality applies to the residuals, checked AFTER running the model — not to the raw dependent variable.",
  },
  multiple_regression:{n:"Multiple Linear Regression",e:"🔮",b:"Parametric",fit:4,
    plain:"Predict a numeric outcome using multiple predictor variables simultaneously",
    tl:"Predict a continuous outcome from multiple predictors",
    why:"Partials out each predictor's unique contribution while controlling for all others — essential when predictors are intercorrelated.",
    ass:["Linear relationships","Normal residuals","Homoscedasticity","No multicollinearity (VIF<10)","Independent observations"],
    alt:{n:"Ridge or Lasso regression",w:"when multicollinearity is severe"},
    eff:"R² (overall); standardised β per predictor; ΔR² per block",
    ex:"Predicting wellbeing from age, social support, and perceived stress simultaneously.",
    viz:"Coefficient plot; residuals vs. fitted",
    spss:"Analyze → Regression → Linear (all IVs in 'Independents')",
    jmv:"Regression → Linear Regression",
    cnt:"Adding more predictors always increases R² — use adjusted R² and ΔR² for honest comparison. Cannot prove causation.",
    sup:"Report the full model F-test, each β with its SE, and ΔR² per step if using hierarchical entry.",
  },
  logistic_regression:{n:"Binary Logistic Regression",e:"⚖️",b:"Parametric",fit:4,
    tl:"Predict the probability of a binary outcome",
    why:"Models log-odds of a binary outcome — handles categorical and continuous predictors while bounding predictions 0–1.",
    ass:["Binary DV","Log-odds linearity with continuous predictors","No multicollinearity","≥20 events per predictor (EPV); older guidelines used ≥10 but simulation studies recommend ≥20 (Riley et al., 2019)","Independent observations"],
    alt:{n:"Probit regression or Decision Tree",w:"for alternative probability modelling"},
    eff:"Nagelkerke R²; Odds Ratios (OR); AUC-ROC",
    ex:"Predicting pass/fail from attendance rate, study hours, and prior GPA.",
    viz:"ROC curve; forest plot of odds ratios",
    spss:"Analyze → Regression → Binary Logistic",
    jmv:"Regression → Logistic Regression → Binomial",
    cnt:"Odds Ratios ≠ probabilities — an OR of 2.0 means twice the odds, not twice as likely (critical distinction for rare outcomes).",
  },
  multinomial_logistic:{n:"Multinomial Logistic Regression",e:"🗂️",b:"Parametric",fit:3,
    tl:"Predict which of 3+ unordered categories",
    why:"Extends binary logistic regression to model all category probabilities simultaneously for a nominal outcome.",
    ass:["Nominal outcome with 3+ categories","No multicollinearity","Adequate sample per category","≥20 EPV per comparison (Riley et al., 2019)"],
    alt:{n:"Ordinal logistic regression",w:"if categories have a meaningful order"},
    eff:"McFadden's R²; odds ratios per comparison",
    ex:"Predicting therapy preference (CBT, DBT, Person-Centred) from symptom profiles.",
    viz:"Probability bar charts; mosaic plot",
    spss:"Analyze → Regression → Multinomial Logistic",
    jmv:"Regression → Logistic Regression → Multinomial",
    cnt:"Results are relative to a reference category — the choice of reference category changes all odds ratio values.",
  },
  chi_square:{n:"Chi-Square Test (χ²)",e:"🔲",b:"Non-Parametric",fit:4,altKey:"fisher_exact",
    plain:"Test whether two categorical variables are linked",
    tl:"Test association between two categorical variables",
    why:"Tests whether observed cell frequencies differ from independence expectations — no distribution assumption needed.",
    ass:["Both variables categorical","Independent observations","Expected cell frequencies ≥5 in ALL cells","Random sampling"],
    alt:{n:"Fisher's Exact Test",w:"when any expected cell frequency is < 5"},
    eff:"Cramér's V — small≥0.10, medium≥0.30, large≥0.50",
    ex:"Gender × preference for face-to-face vs. online therapy.",
    ex_plain:"e.g. Is there a link between stream (Arts/Science/Commerce) and type of career anxiety (low/medium/high)? Is gender associated with preferred study method?",
    viz:"Stacked bar chart; mosaic plot",
    spss:"Analyze → Descriptive Statistics → Crosstabs → Statistics → Chi-square",
    jmv:"Frequencies → Contingency Tables",
    cnt:"Shows that an association exists — not its direction or which specific cells drive it. Inspect standardised residuals for that.",
    sup:"Always verify expected cell frequencies. Report χ², df, p, N, and Cramér's V. If any expected count is <5, switch to Fisher's Exact Test.",
  },
  fisher_exact:{n:"Fisher's Exact Test",e:"🔬",b:"Non-Parametric",fit:4,altKey:"chi_square",
    tl:"Test association when expected cell counts are small",
    why:"Chi-square is unreliable when expected frequencies are <5 — very common in psychology dissertations with small samples. Fisher's calculates the exact probability without the chi-square approximation.",
    ass:["Both variables categorical (typically 2×2 table)","At least one expected cell frequency <5","Independent observations"],
    alt:{n:"Chi-Square Test (χ²)",w:"when all expected cell frequencies are ≥5"},
    eff:"Odds Ratio (OR); phi coefficient φ for 2×2 tables",
    ex:"Treatment type (CBT vs. waitlist) predicting dropout (yes/no) in a small pilot study (n=24).",
    viz:"2×2 contingency table with exact p-value; grouped bar chart of proportions",
    spss:"Analyze → Descriptive Statistics → Crosstabs → Statistics → Chi-square (Fisher's appears automatically for 2×2 tables)",
    jmv:"Frequencies → Contingency Tables → Statistics → Fisher's exact test",
    cnt:"Standard Fisher's is designed for 2×2 tables. For larger tables, use chi-square with cell-count warnings or the Freeman-Halton extension.",
  },
  mcnemar:{n:"McNemar's Test",e:"🔁",b:"Non-Parametric",fit:4,altKey:"cochrans_q",
    tl:"Compare paired binary outcomes — before/after design (2 time points only)",
    why:"The same participants are measured twice on a binary outcome. McNemar's tests whether the proportion of 'yes' changed significantly using only the discordant pairs (those who switched).",
    ass:["Paired binary observations — same participants at both time points","Exactly 2 conditions or time points","Sufficient discordant pairs (ideally >10)","Dichotomous dependent variable"],
    alt:{n:"Cochran's Q Test",w:"for 3+ time points or conditions with binary outcomes"},
    eff:"Odds Ratio (OR) from discordant pairs",
    ex:"Whether participants met the clinical cut-off for depression (yes/no) before vs. after a CBT intervention.",
    viz:"2×2 table showing direction of change; stacked bar comparing proportions",
    spss:"Analyze → Nonparametric Tests → Legacy Dialogs → 2 Related Samples → select McNemar",
    jmv:"Frequencies → Contingency Tables → Statistics → McNemar",
    cnt:"Only analyses participants who changed (discordant pairs) — those who stayed the same contribute nothing to the test statistic.",
  },
  cochrans_q:{n:"Cochran's Q Test",e:"📊",b:"Non-Parametric",fit:3,altKey:"mcnemar",
    tl:"Compare binary outcomes across 3+ related conditions",
    why:"The same participants are measured on a binary outcome across 3+ conditions. Cochran's Q extends McNemar's test to 3+ related samples, testing whether the proportion of positive responses differs across conditions.",
    ass:["Same participants across all conditions","Binary (dichotomous) DV","3+ conditions or time points","Sufficient expected frequencies per condition (≥5 in each marginal total)"],
    alt:{n:"McNemar's Test",w:"when there are only 2 time points or conditions"},
    eff:"Cochran's W; phi coefficient for pairwise comparisons",
    ex:"Testing whether participants meet a clinical cut-off (yes/no) at baseline, 6 weeks, and 3 months post-intervention.",
    viz:"Stacked bar chart of proportions at each time point",
    spss:"Analyze → Nonparametric Tests → Legacy Dialogs → K Related Samples → select Cochran's Q",
    jmv:"Not available natively in jamovi — use SPSS or R (RVAideMemoire package: cochran.qtest())",
    cnt:"Post-hoc pairwise McNemar tests with Bonferroni correction are needed to identify which specific time points differ.",
    ph:"Pairwise McNemar tests with Bonferroni correction",
  },
  mediation_moderation:{n:"Mediation / Moderation Analysis",e:"🔀",b:"Advanced",fit:3,
    plain:"Understand HOW or WHEN a relationship between two variables occurs",
    tl:"Unpack how and when relationships occur",
    why:"Reveals mechanisms (mediation: X→M→Y) or boundary conditions (moderation: when does X→Y change?). This is structurally a series of regression models requiring causal ordering established by theory — not just statistical association.",
    ass:["Causal ordering grounded in theory — not just statistical association","Bootstrapping recommended for indirect effects (n≥200)","Measurement reliability across all variables"],
    alt:{n:"Structural Equation Modelling (SEM)",w:"for complex mediation chains or latent variables"},
    eff:"Mediation: indirect effect (a×b path); Moderation: interaction coefficient β₃",
    ex:"Self-efficacy mediating social support → academic performance (Hayes, 2022).",
    viz:"Path diagram with direct and indirect arrows; interaction plot (Y vs X at levels of W)",
    sw:"PROCESS Macro v4 (Hayes, 2022) — most widely used tool in psychology.",
    spss:"Analyze → Regression → PROCESS v4 → Model 4 (mediation) or Model 1 (moderation)",
    jmv:"Install jAMM or PROCESS module from the jamovi library",
    cnt:"Mediation in correlational data cannot prove causation — it tests a theoretically-specified causal story. The causal direction must be justified by theory and prior research.",
    sup:"Examiners will ask: what is your theoretical justification for the causal ordering? Prepare a clear answer grounded in your literature review.",
  },
};

const WR={
  welch_ttest:["A Welch's independent-samples t-test indicated that [DV] [significantly/did not significantly] differ between [Group 1] (M=___, SD=___) and [Group 2] (M=___, SD=___), t(df)=___, p=.___, d=___.","[Group 1] scored [significantly] [higher/lower] than [Group 2] on [DV] — or — the groups did not significantly differ on [DV]."],
  paired_ttest:["A paired-samples t-test revealed that [DV] [significantly/did not significantly] [increase/decrease] from [Time 1] (M=___, SD=___) to [Time 2] (M=___, SD=___), t(df)=___, p=.___, d=___.","[DV] [significantly changed / did not significantly change] from [Time 1] to [Time 2]."],
  oneway_anova:["A one-way ANOVA indicated a [significant/non-significant] effect of [IV] on [DV], F(df₁,df₂)=___, p=.___, η²=___. Post-hoc comparisons (Tukey HSD) [showed/showed no significant differences — all ps > .05].","There was a [significant/non-significant] difference in [DV] across the groups."],
  rm_anova:["A one-way repeated measures ANOVA indicated a [significant/non-significant] effect of [time/condition] on [DV], F(df₁,df₂)=___, p=.___, η²p=___ [specify: partial or generalised η²].","[DV] [significantly changed / did not significantly change] across the [n] time points."],
  mann_whitney:["A Mann-Whitney U test indicated that [DV] [significantly/did not significantly] differ between [Group 1] (Mdn=___) and [Group 2] (Mdn=___), U=___, z=___, p=.___, r=___.","There was [a significant/no significant] difference between [Group 1] and [Group 2] on [DV]."],
  wilcoxon:["A Wilcoxon signed-rank test indicated that [DV] [significantly/did not significantly] [change] from [Time 1] (Mdn=___) to [Time 2] (Mdn=___), z=___, p=.___, r=___.","[DV] [significantly changed / did not significantly change] from [Time 1] to [Time 2]."],
  kruskal_wallis:["A Kruskal-Wallis test revealed a [significant/non-significant] difference in [DV] across groups, H(df)=___, p=.___, ε²=___.","There was [a significant/no significant] difference in [DV] across the groups."],
  friedman:["A Friedman test indicated a [significant/non-significant] difference in [DV] across conditions, χ²(df)=___, p=.___, W=___.","[DV] [significantly differed / did not significantly differ] across the conditions."],
  pearson:["A Pearson correlation indicated a [significant/non-significant] [positive/negative] relationship between [Var 1] and [Var 2], r(N−2)=.___, p=.___.","There was [a significant/no significant] [positive/negative] linear relationship between [Var 1] and [Var 2]."],
  spearman:["A Spearman's rank-order correlation indicated a [significant/non-significant] [positive/negative] relationship between [Var 1] and [Var 2], ρ(N−2)=.___, p=.___.","There was [a significant/no significant] [positive/negative] monotonic relationship between [Var 1] and [Var 2]."],
  kendalls_tau:["A Kendall's tau-b correlation indicated a [significant/non-significant] [positive/negative] relationship between [Var 1] and [Var 2], τ-b=.___, z=___, p=.___.","There was [a significant/no significant] [positive/negative] association between [Var 1] and [Var 2]."],
  point_biserial:["A point-biserial correlation indicated a [significant/non-significant] [positive/negative] relationship between [continuous variable] and [binary variable], r_pb(N−2)=.___, p=.___.","There was [a significant/no significant] relationship between [continuous variable] and [binary variable]."],
  simple_regression:["[Predictor] [significantly/did not significantly] predict [DV], β=.___, t(df)=___, p=.___, R²=.___.","[Predictor] [significantly/did not significantly] predict [DV], accounting for ___% of its variance."],
  multiple_regression:["Multiple regression indicated the model [significantly/did not significantly] predict [DV], F(df₁,df₂)=___, p=.___, R²=___. [Predictor 1] (β=.___, p=___) [was/was not] a significant predictor.","The predictors [accounted / did not account] for a significant proportion of variance in [DV] (R²=___)."],
  logistic_regression:["Binary logistic regression indicated a [significant/non-significant] model, χ²(df)=___, p=.___, Nagelkerke R²=___. [Predictor] [significantly/did not significantly] predict [DV] (OR=___, 95% CI [___,___], p=___).", "[Predictor] [significantly/did not significantly] predict the likelihood of [DV]."],
  multinomial_logistic:["Multinomial logistic regression predicted [DV]. [Predictor] [significantly/did not significantly] predict [Category A] vs. [Reference] (OR=___, p=___).", "[Predictor] [significantly/did not significantly] predict which [DV] category participants belonged to."],
  chi_square:["A chi-square test of independence indicated a [significant/non-significant] association between [Var 1] and [Var 2], χ²(df)=___, p=.___, N=___, V=___.","There was [a significant/no significant] association between [Var 1] and [Var 2]."],
  fisher_exact:["Fisher's exact test indicated a [significant/non-significant] association between [Var 1] and [Var 2], p=.___ (exact), OR=___, 95% CI [___,___].","There was [a significant/no significant] association between [Var 1] and [Var 2]."],
  mcnemar:["McNemar's test indicated that the proportion of [positive outcome] [significantly/did not significantly] change from [Time 1] (___ %) to [Time 2] (___ %), χ²(1)=___, p=.___, OR=___.","The proportion of participants [showing outcome] [significantly changed / did not significantly change] between [Time 1] and [Time 2]."],
  cochrans_q:["Cochran's Q test indicated that the proportion of [positive outcome] [significantly/did not significantly] differ across conditions, Q(df)=___, p=.___.","The proportion of [positive outcome] [significantly changed / did not significantly change] across the [n] conditions."],
  mediation_moderation:["A mediation analysis using bootstrapping (5,000 samples; Hayes, 2022) indicated a [significant/non-significant] indirect effect of [X] on [Y] through [M], b=.___, 95% CI [___,___].","[M] [significantly / did not significantly] mediate the relationship between [X] and [Y]."],
};

const GP={
  welch_ttest:"t-tests → Means: Two independent groups",
  paired_ttest:"t-tests → Means: Difference between two dependent means (matched pairs)",
  oneway_anova:"F-tests → ANOVA: Fixed effects, omnibus, one-way",
  rm_anova:"F-tests → ANOVA: Repeated measures, within factors",
  mann_whitney:"t-tests → Means: Two independent groups (no direct option — use t-test and add ~15% to N)",
  wilcoxon:"t-tests → Means: Difference between two dependent means (add ~15% to N)",
  kruskal_wallis:"F-tests → ANOVA: Fixed effects, omnibus, one-way (add ~15% to N)",
  friedman:"F-tests → ANOVA: Repeated measures, within factors (add ~15% to N)",
  pearson:"Exact → Correlation: Bivariate normal model",
  spearman:"Exact → Correlation: Bivariate normal model (add ~15% to N)",
  kendalls_tau:"Exact → Correlation: Bivariate normal model (add ~15% to N for Kendall's)",
  point_biserial:"Exact → Correlation: Bivariate normal model (point-biserial = Pearson r)",
  simple_regression:"F-tests → Linear Multiple Regression: Fixed model, R² increase",
  multiple_regression:"F-tests → Linear Multiple Regression: Fixed model, R² increase",
  logistic_regression:"z-tests → Logistic regression",
  multinomial_logistic:"z-tests → Logistic regression (run per pairwise comparison)",
  chi_square:"χ²-tests → Goodness-of-fit tests: Contingency tables",
  fisher_exact:"χ²-tests → Contingency tables (approximation) or use R package 'exact2x2'",
  mcnemar:"χ²-tests → Goodness-of-fit tests: Contingency tables (approximation for McNemar's)",
  cochrans_q:"χ²-tests → Goodness-of-fit tests: Contingency tables (approximation; no direct Cochran's Q option in G*Power)",
  mediation_moderation:"F-tests → Linear Multiple Regression (for direct paths). Use Monte Carlo simulation for indirect effects.",
};
const GP_WARN={
  rm_anova:"⚠️ Change 'Corr among rep measures' from 0 to ~0.5 — the default of 0 severely underestimates required N.",
  mediation_moderation:"⚠️ G*Power cannot compute power for indirect effects. Use the R package 'pwrss' or an online Monte Carlo calculator.",
  fisher_exact:"⚠️ G*Power has no direct Fisher's option. Use chi-square as an approximation or an online exact test power calculator.",
  cochrans_q:"⚠️ G*Power has no direct Cochran's Q option. Use chi-square as an approximation and consult an online power calculator.",
};
const GP_NOTE="Required inputs: α (usually .05), Power (aim for .80 minimum; .90 is increasingly expected), and expected Effect Size from prior literature — Cohen's benchmarks are a last resort, not a substitute for domain-specific estimates.";

function effectiveNorm(a){
  if(a.dvType==="ordinal") return "nonnormal";
  if(a.dvType==="likert"&&a.likertType==="single") return "nonnormal";
  const n=a.normN,r=a.normResult;
  if(!n||!r||r==="unsure") return "unknown";
  if(n==="over100") return r==="nonnormal"?"nonnormal":"normal";
  if(n==="n30_100") return r==="normal"?"normal":"nonnormal";
  return r==="normal"?"normal":"nonnormal"; // under30: only clearly normal gets parametric
}

function recommend(a){
  const ok=effectiveNorm(a)==="normal";
  if(a.objective==="association"){
    if(a.assocType==="ordinal") return "kendalls_tau";
    if(a.cellSize==="small") return "fisher_exact";
    return "chi_square";
  }
  if(a.objective==="relationship"){
    if(a.relType==="mediation") return "mediation_moderation";
    if(a.relType==="two_ordinal") return "kendalls_tau";
    if(a.relType==="cont_binary") return "point_biserial";
    return ok?"pearson":"spearman";
  }
  if(a.objective==="predict"){
    if(a.predDvType==="binary") return "logistic_regression";
    if(a.predDvType==="categorical") return "multinomial_logistic";
    return a.predIvCount==="one"?"simple_regression":"multiple_regression";
  }
  if(a.objective==="compare"){
    if(a.dvType==="categorical") return "chi_square";
    if(a.dvType==="binary"){
      const within=a.design==="paired"||a.design==="repeated";
      if(within){
        if(a.groups==="3plus"||a.design==="repeated") return "cochrans_q";
        return "mcnemar";
      }
      if(a.cellSize==="small") return "fisher_exact";
      return "chi_square";
    }
    if(a.design==="repeated") return ok?"rm_anova":"friedman";
    if(a.groups==="2"){
      if(a.design==="paired") return ok?"paired_ttest":"wilcoxon";
      return ok?"welch_ttest":"mann_whitney";
    }
    if(a.design==="paired") return ok?"rm_anova":"friedman";
    return ok?"oneway_anova":"kruskal_wallis";
  }
  return "pearson";
}

function nextQ(q,a){
  if(q==="objective"){
    if(a.objective==="compare") return "groups";
    if(a.objective==="relationship") return "rel_type";
    if(a.objective==="predict") return "pred_dv_type";
    return "assoc_type";
  }
  if(q==="assoc_type") return a.assocType==="ordinal"?"result":"cell_size";
  if(q==="cell_size") return "result";
  if(q==="groups") return "design";
  if(q==="design") return "dv_type";
  if(q==="dv_type"){
    if(a.dvType==="likert") return "likert_type";
    if(a.dvType==="continuous") return "norm_n";
    if(a.dvType==="ordinal") return "result";
    if(a.dvType==="binary"&&a.objective==="compare"&&a.design==="independent") return "cell_size";
    return "result";
  }
  if(q==="likert_type") return a.likertType==="single"?"result":"norm_n";
  if(q==="rel_type"){
    if(a.relType==="two_continuous") return "norm_n";
    return "result";
  }
  if(q==="pred_dv_type") return a.predDvType==="continuous"?"pred_iv_count":"result";
  if(q==="pred_iv_count") return "result";
  if(q==="norm_n") return "norm_check";
  if(q==="norm_check") return "norm_result";
  if(q==="norm_result") return "result";
  return "result";
}

const QS={
  objective:{title:"What are you trying to find out?",sub:"Pick the option that best matches your research question",Icon:Target,key:"objective",opts:[{id:"compare",label:"Are two or more groups different from each other?",desc:'e.g. "Do hostel students have higher stress than day scholars?"',emoji:"⚖️"},{id:"relationship",label:"Is there a relationship between two variables?",desc:'e.g. "Is social media use related to loneliness?"',emoji:"🔗"},{id:"predict",label:"Can one or more variables predict another?",desc:'e.g. "Can attendance predict exam performance?"',emoji:"🎯"},{id:"association",label:"Are two categories linked to each other?",desc:'e.g. "Is gender linked to career choice?"',emoji:"🔲"}]},
  assoc_type:{title:"What level of measurement are your two variables?",sub:"This determines which association test is most appropriate",Icon:BarChart2,key:"assocType",opts:[{id:"nominal",label:"Both nominal — unordered categories",desc:"e.g. gender × treatment type, diagnosis × therapy preference",emoji:"🗂️"},{id:"ordinal",label:"One or both are ordinal — ordered or ranked",desc:"e.g. education level, agreement scale, ranked preferences",emoji:"🏷️",tip:"ordinal"}]},
  cell_size:{title:"Do you expect any cells to have fewer than 5 observations?",sub:"Chi-square becomes unreliable with very small expected cell counts",info:"Estimate expected counts: (row total × column total) ÷ grand total. If any cell is likely <5, Fisher's Exact Test is more appropriate — very common in small psychology studies.",Icon:AlertTriangle,key:"cellSize",opts:[{id:"adequate",label:"No — all expected cells should have ≥5 observations",desc:"Chi-square is appropriate for your sample size",emoji:"✅"},{id:"small",label:"Yes — some cells may have fewer than 5",desc:"Common with n<40 or very unequal group sizes",emoji:"⚠️"}]},
  groups:{title:"How many groups are you comparing?",sub:"Count the distinct categories or conditions in your study",Icon:Users,key:"groups",opts:[{id:"2",label:"Two groups",desc:"e.g. male vs female, experimental vs control, first year vs final year",emoji:"2️⃣"},{id:"3plus",label:"Three or more groups",desc:"e.g. three teaching methods, four departments, five year groups",emoji:"3️⃣"}]},
  design:{title:"Are the same people in all your groups, or different people?",sub:"This is one of the most important decisions in choosing your statistical test",Icon:GitBranch,key:"design",opts:[{id:"independent",label:"Different people in each group",desc:"Each participant appears in one group only — between-subjects design",emoji:"👥",tip:"independent samples"},{id:"paired",label:"The same people measured twice (before and after)",desc:"Same participants at exactly two time points — pre-test and post-test",emoji:"🔄",tip:"paired samples"},{id:"repeated",label:"The same people measured three or more times",desc:"Same participants across 3 or more conditions or time points",emoji:"🔁",tip:"repeated measures"}]},
  dv_type:{title:"What kind of data is your outcome — the thing you are measuring?",sub:"Your outcome (dependent variable) is the variable you expect might change",Icon:BarChart2,key:"dvType",opts:[{id:"continuous",label:"A number — scores, times, measurements, percentages",desc:"e.g. exam score, reaction time, height, anxiety score on a validated scale",emoji:"📏",tip:"continuous"},{id:"ordinal",label:"Ordered ratings — but the gaps between values are unequal",desc:"e.g. ranked preference (1st, 2nd, 3rd), position in class",emoji:"🏷️",tip:"ordinal"},{id:"likert",label:"A rating scale — e.g. 1 to 5 or 1 to 7",desc:"e.g. 'How stressed are you?' rated 1 (not at all) to 5 (extremely)",emoji:"⭐"},{id:"binary",label:"A yes/no or two-category outcome",desc:"e.g. pass/fail, present/absent, diagnosed/not diagnosed",emoji:"🔘",tip:"binary"},{id:"categorical",label:"Three or more categories with no natural order",desc:"e.g. preferred counselling type, chosen stream, nationality",emoji:"🗂️",tip:"categorical"}]},
  likert_type:{title:"Is this a single question or a full questionnaire with multiple items?",sub:"This changes which statistical approach is most appropriate",info:"Single question (e.g. 'Rate your stress from 1–5') → treat as ordinal → use non-parametric test.\n\nFull questionnaire (e.g. PSS-10, BDI-II, DASS-21 — items added or averaged) → if n>30, treat as continuous → parametric is acceptable.\n\n⚠️ Before your main analysis, always report Cronbach's alpha to confirm your scale is reliable (α > .70 is acceptable).",Icon:Lightbulb,key:"likertType",opts:[{id:"single",label:"A single rating question",desc:"One question only — e.g. 'How would you rate your overall happiness from 1–7?'",emoji:"1️⃣"},{id:"multi",label:"A questionnaire with multiple items added or averaged together",desc:"e.g. PSS (Perceived Stress Scale), BDI (Beck Depression Inventory), DASS-21",emoji:"📋",tip:"composite scale"}]},
  rel_type:{title:"What kind of relationship are you examining?",sub:"Choose the analysis that best fits your question",Icon:TrendingUp,key:"relType",opts:[{id:"two_continuous",label:"Correlation — two continuous variables",desc:'"How does sleep duration relate to cognitive performance?"',emoji:"📉"},{id:"two_ordinal",label:"Correlation — two ordinal or ranked variables",desc:'"Does education level relate to treatment preference?"',emoji:"🏷️",tip:"kendall"},{id:"cont_binary",label:"Correlation — continuous variable and a binary variable",desc:'"Does reaction time relate to diagnosis status (yes/no)?"',emoji:"⚡"},{id:"mediation",label:"Mediation or moderation analysis",desc:'"Does self-efficacy explain the stress–performance link?" — requires causal theory',emoji:"🔀",tip:"mediation"}]},
  pred_dv_type:{title:"What type is your outcome (dependent) variable?",sub:"The variable you want to predict",Icon:Target,key:"predDvType",opts:[{id:"continuous",label:"Continuous",desc:"Numeric outcome — score, time, measurement",emoji:"📏",tip:"continuous"},{id:"binary",label:"Binary / Dichotomous",desc:"Two categories — pass/fail, recovered/not recovered",emoji:"🔘",tip:"binary"},{id:"categorical",label:"Categorical (3+ unordered categories)",desc:"Multiple groups — e.g. which therapy type chosen",emoji:"🗂️",tip:"categorical"}]},
  pred_iv_count:{title:"How many predictor variables do you have?",sub:"Independent variables entering your model",Icon:BookOpen,key:"predIvCount",opts:[{id:"one",label:"One predictor",desc:"A single independent variable in the model",emoji:"1️⃣"},{id:"multiple",label:"Two or more predictors",desc:"Multiple IVs examined simultaneously",emoji:"🔢"}]},
  norm_n:{title:"How many participants do you have per group?",sub:"Sample size affects how important normality checking is for your analysis",Icon:Users,key:"normN",opts:[{id:"under30",label:"Fewer than 30 per group",desc:"Small sample — normality is more important to check carefully here",emoji:"🔍"},{id:"n30_100",label:"30 to 100 per group",desc:"Medium sample — the Central Limit Theorem helps, but check for obvious skew",emoji:"📊"},{id:"over100",label:"More than 100 per group",desc:"Large sample — parametric tests are generally robust even with some skew",emoji:"📦"}]},
  norm_check:{title:"How did you check whether your data is normally distributed?",sub:"Most psychology data is not perfectly normal — that is completely okay",Icon:Zap,key:"normCheck",opts:[{id:"shapiro",label:"Shapiro-Wilk test (in SPSS: Analyze → Explore → Normality plots)",desc:"A statistical test — p > .05 suggests normality is not violated",emoji:"🔬",tip:"normality"},{id:"qqplot",label:"Q-Q plot (the diagonal line graph in SPSS)",desc:"Visual check — points should follow the diagonal line closely",emoji:"📈"},{id:"histogram",label:"Histogram (a bar chart of your scores)",desc:"Visual check — should look roughly bell-shaped",emoji:"📊"},{id:"all",label:"I used all three methods",desc:"Shapiro-Wilk + Q-Q plot + histogram — this is best practice",emoji:"🧪"},{id:"notchecked",label:"I have not checked yet",desc:"That is okay — describe what you expect based on your data",emoji:"❓"}]},
  norm_result:{title:"What does your data look like?",sub:"Be as honest as you can — if you are unsure, select the last option and we will show you both paths",Icon:BarChart2,key:"normResult",opts:[{id:"normal",label:"Clearly normal — bell-shaped and symmetric",desc:"Histogram looks like a bell; Q-Q plot points follow the diagonal closely; Shapiro-Wilk p > .05",emoji:"🔔"},{id:"nonnormal",label:"Skewed or non-normal — lopsided or has extreme values",desc:"Clear skew in histogram, Q-Q plot curves away, or Shapiro-Wilk p < .05",emoji:"↗️"},{id:"unsure",label:"I am not sure — my results were mixed or unclear",desc:"Methods disagreed, or you are unsure how to interpret the output — we will show you both options",emoji:"🤔"}]},
};

const QID_TO_KEY={objective:"objective",assoc_type:"assocType",cell_size:"cellSize",groups:"groups",design:"design",dv_type:"dvType",likert_type:"likertType",rel_type:"relType",pred_dv_type:"predDvType",pred_iv_count:"predIvCount",norm_n:"normN",norm_check:"normCheck",norm_result:"normResult"};
const CM={objective:{compare:"Group comparison",relationship:"Relationship",predict:"Prediction",association:"Categorical assoc."},assocType:{nominal:"Nominal vars",ordinal:"Ordinal vars"},cellSize:{adequate:"Cells ≥5",small:"Small cells"},groups:{"2":"2 groups","3plus":"3+ groups"},design:{independent:"Independent",paired:"Paired",repeated:"Repeated"},dvType:{continuous:"Continuous DV",ordinal:"Ordinal DV",likert:"Likert DV",binary:"Binary DV",categorical:"Categorical DV"},likertType:{single:"Single item",multi:"Multi-item scale"},relType:{two_continuous:"2 continuous vars",two_ordinal:"2 ordinal vars",cont_binary:"Continuous×binary",mediation:"Mediation/Moderation"},predDvType:{continuous:"Continuous outcome",binary:"Binary outcome",categorical:"Categorical outcome"},predIvCount:{one:"1 predictor",multiple:"Multiple predictors"},normN:{under30:"n<30",n30_100:"n=30–100",over100:"n>100"},normCheck:{shapiro:"Shapiro-Wilk",qqplot:"Q-Q plot",histogram:"Histogram",all:"All 3 methods",notchecked:"Not checked"},normResult:{normal:"Normal",nonnormal:"Non-normal",unsure:"Unsure"}};

function methodsParagraph(a,normChoice){
  const effAns=normChoice?{...a,normResult:normChoice}:a;
  const tk=recommend(effAns),tt=T[tk];if(!tt) return "";
  const nD={under30:"n<30",n30_100:"n=30–100",over100:"n>100"}[a.normN]||"";
  const chD={shapiro:"a Shapiro-Wilk test",qqplot:"Q-Q plot inspection",histogram:"histogram inspection",notchecked:"visual inspection"}[a.normCheck]||"";
  const nrD={normal:"appeared normally distributed",nonnormal:"appeared non-normally distributed",unsure:"was of uncertain normality"}[normChoice||a.normResult]||"";
  let s=`The present study used the ${tt.n}`;
  if(a.objective==="compare") s+=` to compare [dependent variable] between ${a.groups==="2"?"two":"multiple"} ${a.design||"independent"} groups`;
  else if(a.objective==="association") s+=` to test the association between [Variable 1] and [Variable 2]`;
  else if(a.objective==="relationship") s+=` to examine the relationship between [Variable 1] and [Variable 2]`;
  else if(a.objective==="predict") s+=` to predict [outcome variable] from [predictor(s)]`;
  if(chD&&nrD) s+=`. Normality was assessed via ${chD}${nD?" ("+nD+")":""}, and data ${nrD}, supporting the use of ${effectiveNorm(effAns)==="normal"?"a parametric":"a non-parametric"} approach`;
  s+=`. The ${tt.n} was selected as appropriate for this research design.`;
  return s;
}

function HistoGuide({dark,normCheck}){
  const histos=[
    {label:"Normal ✅",bars:[1,3,6,10,13,13,10,6,3,1],col:"#22c55e"},
    {label:"Right-skewed ❌",bars:[13,11,8,6,4,3,2,1,1,1],col:"#ef4444"},
    {label:"Left-skewed ❌",bars:[1,1,1,2,3,4,6,8,11,13],col:"#ef4444"},
    {label:"Bimodal ❌",bars:[2,6,11,7,3,3,7,11,6,2],col:"#f59e0b"},
  ];
  const tx2=dark?"#94a3b8":"#475569";
  const tx3=dark?"#64748b":"#94a3b8";
  const guides={
    shapiro:[
      {icon:"✅",label:"p > .05",text:'Fail to reject normality — treat as normal. Report: "Shapiro-Wilk test indicated normality was not violated, W=___, p=.___"'},
      {icon:"⚠️",label:"p < .05 with n < 50",text:'Likely genuinely non-normal. Use non-parametric. Report: "The Shapiro-Wilk test indicated a significant departure from normality, W=___, p=.___, therefore a non-parametric test was used."'},
      {icon:"⚠️",label:"p < .05 with n > 50",text:"Shapiro-Wilk is oversensitive with large samples — even trivial deviations become significant. Check your Q-Q plot instead. If points follow the diagonal, data is likely fine for parametric tests."},
    ],
    qqplot:[
      {icon:"✅",label:"Points hug the diagonal",text:'Data is approximately normal. Report: "Visual inspection of the Q-Q plot indicated that residuals were approximately normally distributed."'},
      {icon:"❌",label:"Points curve away (S-shape or arc)",text:'Non-normal — an S-curve suggests skew; an arc suggests kurtosis. Report: "Q-Q plot inspection revealed a departure from normality, therefore a non-parametric test was selected."'},
      {icon:"⚠️",label:"Only end-points drift",text:"Minor end-point drift is common and usually acceptable, especially with n>30. If the central portion follows the diagonal, parametric tests are likely fine."},
    ],
    histogram:[
      {icon:"✅",label:"Bell-shaped and symmetric",text:'Approximately normal. Report: "Histogram inspection suggested an approximately normal distribution."'},
      {icon:"❌",label:"Clear skew or multiple peaks",text:'Non-normal. Report: "Histogram inspection revealed a non-normal distribution, therefore a non-parametric test was used."'},
      {icon:"⚠️",label:"Unsure or irregular shape",text:"Histograms can be misleading with small samples. Combine with a Q-Q plot or Shapiro-Wilk for more confidence before deciding."},
    ],
    all:[
      {icon:"🥇",label:"All three agree: normal",text:'High confidence — use parametric. Report both methods together: "Normality was assessed via Shapiro-Wilk test (W=___, p=.___) and visual inspection of Q-Q plots and histograms. Data appeared approximately normally distributed."'},
      {icon:"🔴",label:"All three agree: non-normal",text:'Clear non-normality — use non-parametric. Report: "Normality was assessed via Shapiro-Wilk test, Q-Q plots, and histogram inspection. Results consistently indicated a departure from normality, therefore a non-parametric test was used."'},
      {icon:"⚠️",label:"Methods disagree — priority order",text:"This is common! Prioritise: (1) Q-Q plot with n>30 — the most practical visual method; (2) Shapiro-Wilk only if n<50; (3) ignore Shapiro-Wilk if n>100. If still unsure, choose non-parametric — minimal power cost and avoids assumption violations."},
    ],
  };
  const guide=guides[normCheck]||null;
  return(<div style={{marginBottom:14,display:"flex",flexDirection:"column",gap:10}}>
    <div style={{padding:"12px 14px",borderRadius:12,background:dark?"rgba(99,102,241,.08)":"#f5f3ff",border:`1px solid ${dark?"rgba(99,102,241,.2)":"#ddd6fe"}`}}>
      <p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:dark?"#a5b4fc":"#4f46e5",margin:"0 0 10px"}}>Histogram shape guide — what does yours look like?</p>
      <div style={{display:"flex",gap:8,justifyContent:"space-around",flexWrap:"wrap"}}>
        {histos.map(({label,bars,col})=>{const max=Math.max(...bars);return(<div key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <svg width="52" height="32" viewBox="0 0 52 32">{bars.map((h,i)=><rect key={i} x={i*5.2} y={32-(h/max)*28} width="4.5" height={(h/max)*28} fill={col} opacity={dark?.7:.5} rx="1"/>)}</svg>
          <span style={{fontSize:9.5,fontWeight:600,color:col,textAlign:"center",maxWidth:60}}>{label}</span>
        </div>);})}
      </div>
      <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.06)"}`}}>
        <p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:dark?"#a5b4fc":"#4f46e5",margin:"0 0 7px"}}>Q-Q plot guide — what to look for</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"space-around"}}>
          {[
            {label:"Normal ✅",desc:"Points follow diagonal closely",col:"#22c55e"},
            {label:"Skewed ❌",desc:"Points curve away in S-shape",col:"#ef4444"},
            {label:"Heavy tails ⚠️",desc:"End-points drift off line only",col:"#f59e0b"},
          ].map(({label,desc,col})=>(
            <div key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,flex:"1 1 80px"}}>
              <svg width="52" height="32" viewBox="0 0 52 32">
                <line x1="4" y1="28" x2="48" y2="4" stroke={dark?"#475569":"#cbd5e1"} strokeWidth="1.5" strokeDasharray="3,2"/>
                {col==="#22c55e"&&[{x:6,y:26},{x:15,y:21},{x:26,y:16},{x:37,y:11},{x:46,y:6}].map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.5" fill={col} opacity=".8"/>)}
                {col==="#ef4444"&&[{x:6,y:22},{x:15,y:22},{x:26,y:16},{x:37,y:10},{x:46,y:10}].map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.5" fill={col} opacity=".8"/>)}
                {col==="#f59e0b"&&[{x:6,y:23},{x:15,y:21},{x:26,y:16},{x:37,y:11},{x:46,y:9}].map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.5" fill={col} opacity=".8"/>)}
              </svg>
              <span style={{fontSize:9.5,fontWeight:600,color:col,textAlign:"center"}}>{label}</span>
              <span style={{fontSize:9,color:tx3,textAlign:"center",maxWidth:80,lineHeight:1.3}}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    {guide&&<div style={{padding:"12px 14px",borderRadius:12,background:dark?"rgba(251,191,36,.06)":"#fefce8",border:`1px solid ${dark?"rgba(251,191,36,.2)":"#fde68a"}`}}>
      <p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:dark?"#fbbf24":"#92400e",margin:"0 0 8px"}}>
        📋 How to interpret &amp; report — {normCheck==="all"?"using all three methods":normCheck==="shapiro"?"Shapiro-Wilk":normCheck==="qqplot"?"Q-Q plot":"histogram"}
      </p>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {guide.map(({icon,label,text},i)=>(
          <div key={i} style={{padding:"8px 10px",borderRadius:9,background:dark?"rgba(0,0,0,.2)":"rgba(255,255,255,.7)"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
              <span style={{fontSize:12}}>{icon}</span>
              <span style={{fontSize:11,fontWeight:700,color:dark?"#fde68a":"#78350f"}}>{label}</span>
            </div>
            <p style={{fontSize:11.5,color:tx2,margin:0,lineHeight:1.6}}>{text}</p>
          </div>
        ))}
      </div>
    </div>}
  </div>);}


// ─── GLOSSARY MODAL ───────────────────────────────────────────────────────────
function GlossaryModal({dark,onClose}){
  const [search,setSearch]=useState("");
  const tx1=dark?"#f1f5f9":"#0f172a";
  const tx2=dark?"#94a3b8":"#475569";
  const tx3=dark?"#64748b":"#94a3b8";
  const filtered=Object.entries(GLOSSARY).filter(([k])=>k.toLowerCase().includes(search.toLowerCase()));
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(0,0,0,.5)",backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:520,maxHeight:"80vh",borderRadius:20,background:dark?"#1e293b":"#fff",border:dark?"1.5px solid #334155":"1.5px solid #e2e8f0",boxShadow:"0 20px 60px rgba(0,0,0,.3)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"16px 18px",borderBottom:dark?"1px solid #334155":"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:10}}>
          <HelpCircle size={16} style={{color:"#6366f1",flexShrink:0}}/>
          <div style={{flex:1}}>
            <p style={{fontSize:14,fontWeight:700,color:tx1,margin:0}}>Statistics Glossary</p>
            <p style={{fontSize:11,color:tx3,margin:0}}>Plain-English definitions of every term used in this app</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:tx3,lineHeight:1,padding:2}}>✕</button>
        </div>
        <div style={{padding:"10px 18px",borderBottom:dark?"1px solid #334155":"1px solid #f1f5f9"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search terms..." style={{width:"100%",padding:"8px 12px",borderRadius:10,border:dark?"1px solid #334155":"1px solid #e2e8f0",background:dark?"#0f172a":"#f8fafc",color:tx1,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{overflowY:"auto",padding:"12px 18px",display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(([term,def])=>(
            <div key={term} style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(99,102,241,.06)":"#f8fafc",border:dark?"1px solid #334155":"1px solid #f1f5f9"}}>
              <p style={{fontSize:12.5,fontWeight:700,color:dark?"#a5b4fc":"#4f46e5",margin:"0 0 4px",textTransform:"capitalize"}}>{term}</p>
              <p style={{fontSize:12,color:tx2,margin:0,lineHeight:1.7,whiteSpace:"pre-line"}}>{def}</p>
            </div>
          ))}
          {filtered.length===0&&<p style={{fontSize:13,color:tx3,textAlign:"center",padding:"20px 0"}}>No terms found for "{search}"</p>}
        </div>
      </div>
    </div>
  );
}

function Tip({term,dark}){
  const [s,setS]=useState(false);if(!TIPS[term]) return null;
  return(<span style={{position:"relative",display:"inline-flex"}}><button onMouseEnter={()=>setS(true)} onMouseLeave={()=>setS(false)} onClick={e=>{e.stopPropagation();setS(v=>!v)}} style={{background:"none",border:"none",cursor:"pointer",padding:"0 2px",color:"#818cf8",lineHeight:1}}><Info size={11}/></button>{s&&<span style={{position:"absolute",bottom:"calc(100% + 4px)",left:0,zIndex:99,width:200,fontSize:11,lineHeight:1.6,borderRadius:10,padding:"8px 10px",background:"#1e293b",color:"#e2e8f0",boxShadow:"0 8px 24px rgba(0,0,0,.25)",pointerEvents:"none"}}>{TIPS[term]}</span>}</span>);}

function Opt({o,sel,onSel,dark,beginner=false}){
  return(<button onClick={()=>onSel(o.id)} style={{width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:14,border:sel?"2px solid #6366f1":`1.5px solid ${dark?"#334155":"#e2e8f0"}`,background:sel?(dark?"rgba(99,102,241,.15)":"rgba(99,102,241,.06)"):(dark?"#1e293b":"#fff"),cursor:"pointer",transition:"all .15s",boxShadow:sel?"0 0 0 3px rgba(99,102,241,.15)":"none"}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
      <span style={{fontSize:18,lineHeight:1,marginTop:2,flexShrink:0}}>{o.emoji}</span>
      <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}><span style={{fontWeight:600,fontSize:13,color:sel?(dark?"#a5b4fc":"#4338ca"):(dark?"#f1f5f9":"#1e293b")}}>{beginner?(o.label||o.label_expert):(o.label_expert||o.label)}</span>{o.tip&&<Tip term={o.tip} dark={dark}/>}{sel&&<CheckCircle size={12} style={{color:"#6366f1",marginLeft:"auto",flexShrink:0}}/>}</div><p style={{fontSize:11,margin:"2px 0 0",color:dark?"#64748b":"#94a3b8",lineHeight:1.5}}>{o.desc}</p></div>
    </div>
  </button>);}

function FitBadge({fit,dark}){
  const tx3=dark?"#64748b":"#94a3b8";
  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,flexShrink:0}}>
    <div style={{display:"flex",gap:1}}>{[1,2,3,4,5].map(i=><span key={i} style={{fontSize:13,opacity:i<=fit?1:.12}}>⭐</span>)}</div>
    <div style={{display:"flex",alignItems:"center",gap:2}}><span style={{fontSize:10,fontWeight:700,color:FIT_COL[fit]||tx3}}>{FIT[fit]||""}</span><Tip term="design_fit" dark={dark}/></div>
  </div>);}

function Crumb({hist,ans,dark,onJump}){
  const [hov,setHov]=useState(null);
  const tx3=dark?"#64748b":"#94a3b8";
  const items=[];
  hist.filter(q=>q!=="result"&&q!=="norm_result").forEach(qId=>{
    const k=QID_TO_KEY[qId];if(!k||!ans[k]||!CM[k]?.[ans[k]]) return;
    let label=CM[k][ans[k]];
    if(qId==="norm_check"&&ans.normResult&&CM.normResult?.[ans.normResult]) label+=`: ${CM.normResult[ans.normResult]}`;
    items.push({label,qId});
  });
  if(items.length<2) return null;
  return(<div style={{marginBottom:14,padding:"8px 12px",borderRadius:12,background:dark?"rgba(99,102,241,.06)":"rgba(99,102,241,.04)",border:`1px solid ${dark?"rgba(99,102,241,.2)":"rgba(99,102,241,.12)"}`}}>
    <p style={{fontSize:9,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",color:tx3,margin:"0 0 5px"}}>Your path — click any step to jump back and change your answer</p>
    <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"3px 4px"}}>
      {items.map(({label,qId},i)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:4}}>
        <button onClick={()=>onJump(qId)} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} style={{fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:99,border:"none",cursor:"pointer",transition:"all .15s",background:hov===i?(dark?"rgba(99,102,241,.25)":"rgba(99,102,241,.12)"):(dark?"#334155":"#f1f5f9"),color:hov===i?(dark?"#c7d2fe":"#4338ca"):(dark?"#94a3b8":"#64748b"),textDecoration:hov===i?"underline":"none"}}>{label}</button>
        {i<items.length-1&&<span style={{fontSize:10,color:tx3}}>→</span>}
      </span>))}
    </div>
  </div>);}

function DualPanel({ans,swOverride,dark,onChoose}){
  const pAns={...ans,normResult:"normal"};
  const nAns={...ans,normResult:"nonnormal"};
  const pTK=recommend(pAns),nTK=recommend(nAns);
  const pTT=T[pTK],nTT=T[nTK];
  const tx2=dark?"#94a3b8":"#475569",tx3=dark?"#64748b":"#94a3b8";
  if(!pTT||!nTT||pTK===nTK){if(pTK===nTK) onChoose("normal");return null;}
  return(<div style={{animation:"fadeUp .4s ease-out both"}}>
    <div style={{marginBottom:14,padding:"14px 16px",borderRadius:16,background:swOverride?(dark?"rgba(251,191,36,.1)":"#fefce8"):(dark?"rgba(99,102,241,.1)":"#f5f3ff"),border:`1.5px solid ${swOverride?(dark?"rgba(251,191,36,.35)":"#fde68a"):(dark?"rgba(99,102,241,.3)":"#ddd6fe")}`}}>
      <p style={{fontSize:13,fontWeight:700,color:swOverride?(dark?"#fbbf24":"#92400e"):(dark?"#f1f5f9":"#0f172a"),margin:"0 0 6px"}}>{swOverride?"⚠️ Shapiro-Wilk oversensitivity detected":"🤔 Your normality is unclear — here are both pathways"}</p>
      {swOverride&&<p style={{fontSize:12.5,color:dark?"#fde68a":"#78350f",margin:"0 0 6px"}}>Shapiro-Wilk with n&gt;100 often rejects normality for trivially small deviations. Please check your Q-Q plot — if points roughly follow the diagonal, your data is likely fine for parametric tests.</p>}
      <p style={{fontSize:12.5,color:tx2,margin:0}}>Choose the test that better matches your data. Both are legitimate — choose parametric for more power if assumptions hold, non-parametric for safety.</p>
    </div>
    <div style={{marginBottom:14,padding:"12px 14px",borderRadius:12,background:dark?"rgba(99,102,241,.07)":"#f8fafc",border:`1px solid ${dark?"#334155":"#e2e8f0"}`}}>
      <p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:tx3,margin:"0 0 8px"}}>How to decide</p>
      {[["Q-Q plot points roughly follow the diagonal","→ Parametric is likely fine"],["Histogram bell-shaped with n ≥ 30","→ Parametric is acceptable (CLT)"],["Clear skew, obvious outliers, or n < 30","→ Non-parametric is safer"],["Shapiro-Wilk flagged non-normal with n > 100","→ Check Q-Q plot — probably fine"],["Still genuinely unsure after checking","→ Non-parametric: minimal power cost, avoids violations"]].map(([c,r],i)=>(<div key={i} style={{display:"flex",gap:8,marginBottom:i<4?5:0,flexWrap:"wrap"}}><span style={{fontSize:12,color:tx3,flex:"1 1 160px"}}>{c}</span><span style={{fontSize:12,fontWeight:600,color:dark?"#818cf8":"#4f46e5",flexShrink:0}}>{r}</span></div>))}
    </div>
    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
      {[[pTK,pTT,"If normally distributed","normal","✅ Use parametric","linear-gradient(135deg,#6366f1,#3b82f6)","rgba(99,102,241,.35)"],[nTK,nTT,"If non-normal or unsure","nonnormal","🛡️ Use non-parametric (safer)","linear-gradient(135deg,#22c55e,#16a34a)","rgba(34,197,94,.35)"]].map(([tk,tt,label,choice,btnLabel,btnBg,btnShadow])=>(<div key={choice} style={{flex:"1 1 200px",borderRadius:16,border:`1.5px solid ${dark?"#334155":"#e2e8f0"}`,background:dark?"#1e293b":"#fff",overflow:"hidden"}}>
        <div style={{padding:"5px 14px",background:choice==="normal"?(dark?"rgba(99,102,241,.2)":"rgba(99,102,241,.1)"):(dark?"rgba(34,197,94,.15)":"rgba(34,197,94,.08)")}}>
          <p style={{fontSize:10,fontWeight:700,color:choice==="normal"?(dark?"#a5b4fc":"#4f46e5"):(dark?"#4ade80":"#15803d"),margin:0}}>{label}</p>
        </div>
        <div style={{padding:"12px 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:22}}>{tt.e}</span><p style={{fontSize:13,fontWeight:700,color:dark?"#f1f5f9":"#0f172a",margin:0,lineHeight:1.2}}>{tt.n}</p></div>
          <p style={{fontSize:12,color:tx3,margin:"0 0 6px",lineHeight:1.4}}>{tt.tl}</p>
          <p style={{fontSize:11.5,color:tx2,margin:"0 0 12px"}}><strong>Effect:</strong> {tt.eff.split("—")[0].trim()}</p>
          <button onClick={()=>onChoose(choice)} style={{width:"100%",padding:"9px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:12.5,fontWeight:700,background:btnBg,color:"#fff",boxShadow:`0 3px 10px ${btnShadow}`}}>{btnLabel}</button>
        </div>
      </div>))}
    </div>
  </div>);}

function Result({ans,dark,onReset,hist,onJump,beginner=false}){
  const [tab,setTab]=useState("why");
  const [swOpen,setSwOpen]=useState(null);
  const [copied,setCopied]=useState(null);
  const [viewAlt,setViewAlt]=useState(false);
  const [normChoice,setNormChoice]=useState(null);

  const swOverride=ans.normCheck==="shapiro"&&ans.normN==="over100"&&ans.normResult==="nonnormal";
  const isDual=(ans.normResult==="unsure"||swOverride)&&!normChoice;
  const effectiveAns=normChoice?{...ans,normResult:normChoice}:ans;
  const tk=recommend(effectiveAns);
  const tt=T[tk];
  if(!tt) return null;

  const altTK=tt.altKey;
  const altT=altTK?T[altTK]:null;
  const curTK=viewAlt?altTK:tk;
  const curTT=viewAlt?(altT||null):tt;
  const switchTo=(toAlt)=>{if(toAlt===viewAlt) return;setViewAlt(toAlt);setTab("why");setSwOpen(null);};
  const [bBg,bTx]=BC[(curTT||tt).b]||["#e5e7eb","#374151"];
  const tx2=dark?"#94a3b8":"#475569",tx3=dark?"#64748b":"#94a3b8";
  const surf=dark?"rgba(255,255,255,.04)":"#f8fafc";
  const normNotChecked=ans.normCheck==="notchecked"&&effectiveNorm(effectiveAns)==="normal"&&!isDual;
  const wrData=curTK?WR[curTK]:null;
  const altDisplayName=altT?altT.n:tt.alt.n;
  const TABS_ALL=[["why","Why?",Zap],["run","Run It",BookOpen],["wr","Write Up",Copy],["power","Power",TrendingUp],["ass","Assumptions",AlertTriangle]];
  const TABS_BEG=[["why","What is this test?",Zap],["run","How to run it",BookOpen],["wr","What to write",Copy]];
  const TABS=beginner?TABS_BEG:TABS_ALL;
  const doCopy=(text,key)=>{navigator.clipboard?.writeText(text).catch(()=>{});setCopied(key);setTimeout(()=>setCopied(null),2200);};

  return(<div style={{animation:"fadeUp .4s ease-out both"}}>
    {normNotChecked&&<div style={{marginBottom:10,padding:"10px 14px",borderRadius:12,background:dark?"rgba(59,130,246,.08)":"#eff6ff",border:`1.5px solid ${dark?"rgba(59,130,246,.3)":"#bfdbfe"}`}}><p style={{fontSize:12,fontWeight:600,color:dark?"#60a5fa":"#1d4ed8",margin:0}}>📋 You haven't verified normality yet. Before finalising, run a Shapiro-Wilk test (n&lt;50) or inspect a Q-Q plot in your stats software.</p></div>}

    <Crumb hist={hist} ans={normChoice?{...ans,normResult:normChoice}:ans} dark={dark} onJump={onJump}/>

    {isDual?(
      <>
        <DualPanel ans={ans} swOverride={swOverride} dark={dark} onChoose={setNormChoice}/>
        <button onClick={onReset} style={{width:"100%",marginTop:14,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"11px 0",borderRadius:14,fontSize:12.5,fontWeight:600,cursor:"pointer",border:"none",background:dark?"#334155":"#f1f5f9",color:tx3,transition:"all .15s"}}><RotateCcw size={13}/>Start a new analysis</button>
      </>
    ):(
      <>
        {normChoice&&(ans.normResult==="unsure"||swOverride)&&(
          <button onClick={()=>{setNormChoice(null);setViewAlt(false);}} style={{width:"100%",marginBottom:10,padding:"8px 0",borderRadius:12,border:`1px solid ${dark?"#475569":"#c7d2fe"}`,background:"none",cursor:"pointer",fontSize:12,color:dark?"#818cf8":"#4f46e5",fontWeight:600}}>← Show both options again</button>
        )}
        <div style={{borderRadius:20,padding:"20px 20px 16px",marginBottom:10,background:dark?"linear-gradient(135deg,rgba(67,56,202,.4),rgba(30,41,59,.95))":"linear-gradient(135deg,#eef2ff,#eff6ff)",border:dark?"1.5px solid rgba(99,102,241,.4)":"1.5px solid #c7d2fe"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                {!viewAlt?<><CheckCircle size={14} style={{color:"#22c55e"}}/><span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:"#22c55e"}}>Recommended Test</span></>:<><span style={{fontSize:12}}>🔄</span><span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:dark?"#818cf8":"#6366f1"}}>Alternative Test — Exploring</span></>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><span style={{fontSize:24}}>{(curTT||tt).e}</span><h2 style={{margin:0,fontSize:18,fontWeight:700,color:dark?"#f1f5f9":"#0f172a",lineHeight:1.2}}>{(curTT||tt).n}</h2></div>
              <p style={{margin:"0 0 10px",fontSize:12.5,color:tx2}}>{beginner?((curTT||tt).plain||(curTT||tt).tl):(curTT||tt).tl}</p>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}><span style={{padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,background:bBg,color:bTx}}>{(curTT||tt).b}</span>{(curTT||tt).ph&&<span style={{padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:600,background:dark?"#334155":"#fff",color:tx3,border:`1px solid ${dark?"#475569":"#e2e8f0"}`}}>Post-hoc needed</span>}</div>
            </div>
            <FitBadge fit={(curTT||tt).fit} dark={dark}/>
          </div>
          <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.07)"}`,display:"flex",gap:8}}>
            <button onClick={()=>switchTo(false)} style={{flex:1,textAlign:"left",padding:"9px 11px",borderRadius:11,border:!viewAlt?"2px solid #6366f1":`1.5px solid ${dark?"#475569":"#e2e8f0"}`,background:!viewAlt?(dark?"rgba(99,102,241,.2)":"rgba(99,102,241,.1)"):surf,cursor:"pointer",transition:"all .15s"}}>
              <p style={{fontSize:10,fontWeight:700,color:!viewAlt?(dark?"#a5b4fc":"#4f46e5"):tx3,margin:"0 0 2px"}}>{!viewAlt?"● SHOWING — ":""}✅ RECOMMENDED</p>
              <p style={{fontSize:11.5,fontWeight:600,color:!viewAlt?(dark?"#e0e7ff":"#3730a3"):(dark?"#94a3b8":"#64748b"),margin:0}}>{tt.n}</p>
            </button>
            <button onClick={()=>switchTo(true)} style={{flex:1,textAlign:"left",padding:"9px 11px",borderRadius:11,border:viewAlt?"2px solid #6366f1":`1.5px solid ${dark?"#475569":"#e2e8f0"}`,background:viewAlt?(dark?"rgba(99,102,241,.2)":"rgba(99,102,241,.1)"):surf,cursor:"pointer",transition:"all .15s"}}>
              <p style={{fontSize:10,fontWeight:700,color:viewAlt?(dark?"#a5b4fc":"#4f46e5"):tx3,margin:"0 0 2px"}}>{viewAlt?"● SHOWING — ":""}🔄 ALTERNATIVE</p>
              <p style={{fontSize:11.5,fontWeight:600,color:viewAlt?(dark?"#e0e7ff":"#3730a3"):(dark?"#94a3b8":"#64748b"),margin:0}}>{altDisplayName}</p>
              {!viewAlt&&<p style={{fontSize:10.5,color:tx3,margin:"2px 0 0"}}>{tt.alt.w.charAt(0).toUpperCase()+tt.alt.w.slice(1)}</p>}
            </button>
          </div>
        </div>

        {curTT?(
          <div style={{borderRadius:20,overflow:"hidden",background:dark?"#1e293b":"#fff",border:dark?"1.5px solid #334155":"1.5px solid #e2e8f0",boxShadow:dark?"none":"0 4px 24px rgba(0,0,0,.06)"}}>
            <div style={{display:"flex",borderBottom:dark?"1px solid #334155":"1px solid #f1f5f9",overflowX:"auto"}}>
              {TABS.map(([id,lbl,Ic])=>(<button key={id} onClick={()=>setTab(id)} style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"12px 14px",fontSize:11,fontWeight:600,border:"none",cursor:"pointer",whiteSpace:"nowrap",borderBottom:tab===id?"2.5px solid #6366f1":"2.5px solid transparent",background:tab===id?(dark?"rgba(99,102,241,.12)":"rgba(99,102,241,.05)"):"transparent",color:tab===id?(dark?"#a5b4fc":"#4f46e5"):(dark?"#64748b":"#94a3b8"),transition:"all .15s"}}><Ic size={11}/>{lbl}</button>))}
            </div>
            <div style={{padding:"18px 20px"}}>
              {tab==="why"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:tx3,margin:"0 0 5px"}}>Why this test?</p><p style={{fontSize:13,lineHeight:1.7,color:tx2,margin:0}}>{curTT.why}</p></div>
                <div style={{padding:"12px 14px",borderRadius:12,background:dark?"rgba(34,197,94,.07)":"#f0fdf4",border:`1px solid ${dark?"rgba(34,197,94,.18)":"#bbf7d0"}`}}><p style={{fontSize:10,fontWeight:700,color:dark?"#4ade80":"#15803d",margin:"0 0 4px"}}>💡 Example from psychology research</p><p style={{fontSize:13,lineHeight:1.7,color:dark?"#86efac":"#166634",margin:0}}>{beginner?(curTT.ex_plain||curTT.ex):curTT.ex}</p></div>
                <div><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:tx3,margin:"0 0 5px"}}>Effect size</p><p style={{fontSize:13,color:tx2,margin:0}}>{curTT.eff}</p></div>
                <div><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:tx3,margin:"0 0 5px"}}>Suggested visualisation</p><p style={{fontSize:13,color:tx2,margin:0}}>{curTT.viz}</p></div>
                {curTT.cnt&&<div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(239,68,68,.07)":"#fef2f2",border:`1px solid ${dark?"rgba(239,68,68,.2)":"#fecaca"}`}}><p style={{fontSize:10,fontWeight:700,color:dark?"#f87171":"#dc2626",margin:"0 0 3px"}}>🚫 This test cannot tell you</p><p style={{fontSize:12.5,color:dark?"#fca5a5":"#991b1b",margin:0}}>{curTT.cnt}</p></div>}
                {curTT.sup&&<div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(251,191,36,.08)":"#fefce8",border:`1px solid ${dark?"rgba(251,191,36,.2)":"#fde68a"}`}}><p style={{fontSize:10,fontWeight:700,color:dark?"#fbbf24":"#92400e",margin:"0 0 3px"}}>💬 Supervisor tip</p><p style={{fontSize:12.5,color:dark?"#fde68a":"#78350f",margin:0,whiteSpace:"pre-line"}}>{curTT.sup}</p></div>}
                {curTT.sw&&<div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(139,92,246,.1)":"#f5f3ff",border:`1px solid ${dark?"rgba(139,92,246,.25)":"#ddd6fe"}`}}><p style={{fontSize:11.5,color:dark?"#c4b5fd":"#5b21b6",margin:0}}>💡 <strong>Software tip:</strong> {curTT.sw}</p></div>}
                <div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(255,255,255,.03)":"#f8fafc",border:`1px solid ${dark?"#334155":"#e2e8f0"}`}}><p style={{fontSize:11.5,color:tx3,margin:0}}>⚠️ <strong>Running multiple tests?</strong> If you are running several analyses on the same dataset, consider applying a Bonferroni correction (divide your α by the number of tests) to control the family-wise error rate. Discuss this with your supervisor.</p></div>
              </div>}
              {tab==="run"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
                {beginner&&<div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(34,197,94,.07)":"#f0fdf4",border:`1px solid ${dark?"rgba(34,197,94,.18)":"#bbf7d0"}`}}><p style={{fontSize:12,color:dark?"#86efac":"#166634",margin:0}}>📌 <strong>Most Indian universities use SPSS.</strong> Follow the SPSS steps below. jamovi is a free alternative — download at jamovi.org</p></div>}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}><p style={{fontSize:12,color:tx2,margin:0}}>Step-by-step for common software:</p><span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:dark?"rgba(34,197,94,.1)":"#f0fdf4",color:dark?"#4ade80":"#15803d",border:`1px solid ${dark?"rgba(34,197,94,.2)":"#bbf7d0"}`}}>jamovi &amp; JASP are free</span></div>
                {[["SPSS",curTT.spss],["jamovi (free)",curTT.jmv],["JASP (free)","Same pathway as jamovi. Open JASP, navigate to the equivalent test section, and move your variables across."]].map(([swName,step])=>(<div key={swName} style={{borderRadius:12,overflow:"hidden",border:`1px solid ${dark?"#334155":"#e2e8f0"}`}}><button onClick={()=>setSwOpen(swOpen===swName?null:swName)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:dark?"#0f172a":"#f8fafc",border:"none",cursor:"pointer",color:dark?"#f1f5f9":"#1e293b"}}><span style={{fontSize:12.5,fontWeight:600}}>{swName}</span><ChevronDown size={14} style={{transform:swOpen===swName?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}/></button>{swOpen===swName&&<div style={{padding:"10px 14px",background:dark?"#1e293b":"#fff"}}><p style={{fontSize:13,lineHeight:1.7,color:tx2,margin:0,background:dark?"#0f172a":"#f1f5f9",padding:"8px 10px",borderRadius:8,fontFamily:"monospace"}}>{step}</p></div>}</div>))}
              </div>}
              {tab==="wr"&&wrData&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(99,102,241,.08)":"#f5f3ff",border:`1px solid ${dark?"rgba(99,102,241,.18)":"#ddd6fe"}`}}><p style={{fontSize:11.5,color:dark?"#a5b4fc":"#4f46e5",margin:0}}>📝 Fill in the blanks. Use <strong>[significantly]</strong> if p &lt; .05; replace with <strong>[not significantly]</strong> and adjust wording if p ≥ .05.</p></div>
                <div style={{padding:"12px 14px",borderRadius:12,background:dark?"rgba(99,102,241,.08)":"#f5f3ff",border:`1px solid ${dark?"rgba(99,102,241,.2)":"#ddd6fe"}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:dark?"#a5b4fc":"#4f46e5",margin:0}}>APA 7th Edition Template</p><button onClick={()=>doCopy(wrData[0],"apa")} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:8,background:"none",border:`1px solid ${dark?"#475569":"#c7d2fe"}`,cursor:"pointer",fontSize:11,color:dark?"#818cf8":"#4f46e5"}}><Copy size={10}/>{copied==="apa"?"✓ Copied!":"Copy"}</button></div>
                  <p style={{fontSize:13,lineHeight:1.8,color:tx2,margin:0,fontFamily:"Georgia,serif"}}>{wrData[0]}</p>
                </div>
                <div style={{padding:"12px 14px",borderRadius:12,background:dark?"rgba(34,197,94,.06)":"#f0fdf4",border:`1px solid ${dark?"rgba(34,197,94,.15)":"#bbf7d0"}`}}><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:dark?"#4ade80":"#15803d",margin:"0 0 5px"}}>In plain English</p><p style={{fontSize:13,lineHeight:1.7,color:dark?"#86efac":"#166534",margin:0}}>{wrData[1]}</p></div>
                <div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(251,191,36,.08)":"#fefce8",border:`1px solid ${dark?"rgba(251,191,36,.2)":"#fde68a"}`}}><p style={{fontSize:11.5,color:dark?"#fbbf24":"#92400e",margin:0}}>⚠️ Never write "proves" or "accepts H₀" — write "suggests", "indicates", or "failed to reject H₀" instead.</p></div>
              </div>}
              {tab==="power"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{padding:"12px 14px",borderRadius:12,background:dark?"rgba(99,102,241,.08)":"#f5f3ff",border:`1px solid ${dark?"rgba(99,102,241,.2)":"#ddd6fe"}`}}><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:dark?"#a5b4fc":"#4f46e5",margin:"0 0 6px"}}>G*Power path</p><p style={{fontSize:13,color:tx2,margin:0,fontFamily:"monospace",background:dark?"#0f172a":"#f1f5f9",padding:"8px 10px",borderRadius:8}}>{curTK&&GP[curTK]||"Check G*Power documentation."}</p></div>
                <div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(59,130,246,.08)":"#eff6ff",border:`1px solid ${dark?"rgba(59,130,246,.2)":"#bfdbfe"}`}}><p style={{fontSize:12,color:dark?"#93c5fd":"#1e40af",margin:0}}>{GP_NOTE}</p></div>
                {curTK&&GP_WARN[curTK]&&<div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(251,191,36,.08)":"#fefce8",border:`1px solid ${dark?"rgba(251,191,36,.2)":"#fde68a"}`}}><p style={{fontSize:12,color:dark?"#fbbf24":"#92400e",margin:0}}>{GP_WARN[curTK]}</p></div>}
                <div style={{padding:"12px 14px",borderRadius:12,background:surf,border:`1px solid ${dark?"#334155":"#e2e8f0"}`}}><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:tx3,margin:"0 0 6px"}}>Effect size for this test</p><p style={{fontSize:13,color:tx2,margin:0}}>{curTT.eff}</p></div>
                <p style={{fontSize:11,color:tx3,margin:0,textAlign:"center"}}>G*Power is free — search "G*Power Faul 2007" to download.</p>
              </div>}
              {tab==="ass"&&<div>
                <p style={{fontSize:12.5,color:tx3,marginTop:0,marginBottom:12}}>Your data doesn't need to be perfect — verify these before running your analysis:</p>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>{curTT.ass.map((a,i)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"9px 11px",borderRadius:10,background:surf}}><span style={{width:18,height:18,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,marginTop:1,background:dark?"rgba(99,102,241,.25)":"#ede9fe",color:dark?"#a5b4fc":"#4f46e5"}}>{i+1}</span><p style={{fontSize:12.5,lineHeight:1.6,color:tx2,margin:0}}>{a}</p></div>))}</div>
                {curTT.ph&&<div style={{marginTop:12,padding:"11px 13px",borderRadius:12,background:dark?"rgba(59,130,246,.08)":"#eff6ff",border:`1px solid ${dark?"rgba(59,130,246,.2)":"#bfdbfe"}`}}><p style={{fontSize:10,fontWeight:700,color:dark?"#60a5fa":"#1d4ed8",margin:"0 0 3px"}}>📋 Post-hoc tests required</p><p style={{fontSize:12.5,color:dark?"#93c5fd":"#1e40af",margin:0}}>{curTT.ph}</p></div>}
              </div>}
            </div>
          </div>
        ):(
          <div style={{borderRadius:20,padding:"20px",background:dark?"#1e293b":"#fff",border:dark?"1.5px solid #334155":"1.5px solid #e2e8f0"}}>
            <p style={{fontSize:14,fontWeight:600,color:dark?"#f1f5f9":"#0f172a",margin:"0 0 8px"}}>{altDisplayName}</p>
            <p style={{fontSize:13,lineHeight:1.7,color:tx2,margin:"0 0 10px"}}>Use the {altDisplayName} <strong>{tt.alt.w}</strong>.</p>
            <p style={{fontSize:12.5,color:tx3,margin:0}}>Full details for this test aren't included in our selector. Consult Field (2018), your supervisor, or your software documentation for guidance.</p>
          </div>
        )}

        <button onClick={()=>doCopy(methodsParagraph(ans,normChoice),"methods")} style={{width:"100%",marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"11px 0",borderRadius:14,fontSize:12.5,fontWeight:600,cursor:"pointer",border:`1px solid ${dark?"#334155":"#e2e8f0"}`,background:dark?"#1e293b":"#fff",color:tx2,transition:"all .15s"}}>
          <Copy size={13}/>{copied==="methods"?"✓ Copied to clipboard!":"Copy methods justification paragraph"}
        </button>
        <button onClick={onReset} style={{width:"100%",marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"11px 0",borderRadius:14,fontSize:12.5,fontWeight:600,cursor:"pointer",border:"none",background:dark?"#334155":"#f1f5f9",color:tx3,transition:"all .15s"}}>
          <RotateCcw size={13}/>Start a new analysis
        </button>
      </>
    )}
  </div>);}

function Question({qId,ans,onAns,onNext,onPrev,isFirst,animDir,dark,beginner=false}){
  const q=QS[qId];if(!q) return null;
  const {Icon}=q,sel=ans[q.key];
  const tx3=dark?"#64748b":"#94a3b8";
  const swWarn=qId==="norm_result"&&ans.normCheck==="shapiro"&&ans.normN==="over100";
  return(<div style={{animation:`${animDir==="forward"?"slideR":"slideL"} .3s ease-out both`}}>
    <div style={{borderRadius:22,padding:"22px 20px",background:dark?"#1e293b":"#fff",border:dark?"1.5px solid #334155":"1.5px solid #e2e8f0",boxShadow:dark?"none":"0 4px 32px rgba(0,0,0,.07)"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:q.info||swWarn||qId==="norm_result"?12:16}}>
        <div style={{padding:9,borderRadius:11,flexShrink:0,background:dark?"rgba(99,102,241,.15)":"#eef2ff",color:dark?"#818cf8":"#4f46e5"}}><Icon size={17}/></div>
        <div><h2 style={{margin:0,fontSize:15.5,fontWeight:700,color:dark?"#f1f5f9":"#0f172a",lineHeight:1.3}}>{beginner?(q.title||q.title_expert):(q.title_expert||q.title)}</h2><p style={{margin:"3px 0 0",fontSize:11,color:tx3}}>{q.sub}</p></div>
      </div>
      {qId==="norm_result"&&<HistoGuide dark={dark} normCheck={ans.normCheck}/>}
      {q.info&&<div style={{marginBottom:14,padding:"10px 12px",borderRadius:12,background:dark?"rgba(99,102,241,.1)":"#f5f3ff",border:`1px solid ${dark?"rgba(99,102,241,.25)":"#ddd6fe"}`}}><p style={{fontSize:12,lineHeight:1.6,color:dark?"#c4b5fd":"#5b21b6",margin:0,whiteSpace:"pre-line"}}>💡 {q.info}</p></div>}
      {swWarn&&<div style={{marginBottom:14,padding:"10px 12px",borderRadius:12,background:dark?"rgba(251,191,36,.08)":"#fefce8",border:`1px solid ${dark?"rgba(251,191,36,.2)":"#fde68a"}`}}><p style={{fontSize:12,lineHeight:1.6,color:dark?"#fbbf24":"#92400e",margin:0}}>⚠️ Shapiro-Wilk is oversensitive with n&gt;100 — trivial deviations may be flagged. Consider selecting "I'm not sure" to see both pathways, or verify with a Q-Q plot first.</p></div>}
      <div style={{display:"flex",flexDirection:"column",gap:7}}>{q.opts.map(o=><Opt key={o.id} o={o} sel={sel===o.id} onSel={v=>onAns(q.key,v)} dark={dark} beginner={beginner}/>)}</div>
      <div style={{display:"flex",gap:9,marginTop:16}}>
        <button onClick={onPrev} disabled={isFirst} style={{display:"flex",alignItems:"center",gap:4,padding:"10px 15px",borderRadius:11,fontSize:12.5,fontWeight:600,cursor:isFirst?"not-allowed":"pointer",border:"none",opacity:isFirst?.25:1,background:dark?"#334155":"#f1f5f9",color:tx3,transition:"all .15s"}}><ChevronLeft size={14}/>Back</button>
        <button onClick={onNext} disabled={!sel} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"10px 0",borderRadius:11,fontSize:13,fontWeight:700,border:"none",cursor:sel?"pointer":"not-allowed",transition:"all .15s",background:sel?"linear-gradient(135deg,#6366f1,#3b82f6)":"#e2e8f0",color:sel?"#fff":"#94a3b8",boxShadow:sel?"0 4px 14px rgba(99,102,241,.35)":"none"}}>Continue<ChevronRight size={14}/></button>
      </div>
    </div>
  </div>);}

export default function App(){
  const [dark,setDark]=useState(false);
  const [beginner,setBeginner]=useState(true);
  const [showGlossary,setShowGlossary]=useState(false);
  const [cQ,setCQ]=useState("objective");
  const [ans,setAns]=useState({});
  const [hist,setHist]=useState(["objective"]);
  const [aKey,setAKey]=useState(0);
  const [aDir,setADir]=useState("forward");
  const go=(dir,q)=>{setADir(dir);setAKey(k=>k+1);setCQ(q);};
  const handleNext=()=>{if(!ans[QS[cQ]?.key]) return;const nq=nextQ(cQ,ans);setHist(h=>[...h,nq]);go("forward",nq);};
  const handlePrev=()=>{if(hist.length<=1) return;const nh=hist.slice(0,-1);setHist(nh);go("backward",nh[nh.length-1]);};
  const handleJump=(targetQId)=>{
    const idx=hist.indexOf(targetQId);if(idx<0) return;
    const newHist=hist.slice(0,idx+1);
    const after=hist.slice(idx+1);
    const newAns={...ans};
    after.forEach(qId=>{const k=QID_TO_KEY[qId];if(k) delete newAns[k];});
    setAns(newAns);setHist(newHist);go("backward",targetQId);
  };
  const reset=()=>{setAns({});setHist(["objective"]);go("forward","objective");};
  const progress=cQ==="result"?100:Math.min(90,Math.round((hist.length/10)*100));
  const tx1=dark?"#f1f5f9":"#0f172a",tx3=dark?"#64748b":"#94a3b8",tx2=dark?"#94a3b8":"#475569";

  // Shared header + progress used in both layouts
  const Header=(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
          <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(99,102,241,.4)"}}><BarChart2 size={14} color="#fff"/></div>
          <span style={{fontSize:17,fontWeight:800,color:tx1}}>Stat<span style={{color:"#6366f1"}}>Test</span></span>
          <span style={{fontSize:10,padding:"2px 8px",borderRadius:999,fontWeight:700,letterSpacing:".06em",background:dark?"rgba(99,102,241,.2)":"#eef2ff",color:dark?"#818cf8":"#4f46e5"}}>SELECTOR</span>
        </div>
        <p style={{margin:0,fontSize:11,color:tx3,paddingLeft:38}}>For psychology &amp; social science students</p>
      </div>
      <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
        <div style={{display:"flex",alignItems:"center",gap:2,padding:"3px 4px",borderRadius:10,background:dark?"#1e293b":"#f1f5f9",border:dark?"1px solid #334155":"1px solid #e2e8f0"}}>
          <button onClick={()=>setBeginner(true)} style={{padding:"4px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:10.5,fontWeight:700,transition:"all .15s",background:beginner?"#6366f1":"transparent",color:beginner?"#fff":(dark?"#64748b":"#94a3b8")}}>Beginner</button>
          <button onClick={()=>setBeginner(false)} style={{padding:"4px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:10.5,fontWeight:700,transition:"all .15s",background:!beginner?"#6366f1":"transparent",color:!beginner?"#fff":(dark?"#64748b":"#94a3b8")}}>Expert</button>
        </div>
        <button onClick={()=>setShowGlossary(true)} style={{padding:7,borderRadius:10,background:"none",border:"none",cursor:"pointer",color:dark?"#818cf8":"#6366f1"}} title="Glossary"><HelpCircle size={14}/></button>
        <button onClick={reset} style={{padding:7,borderRadius:10,background:"none",border:"none",cursor:"pointer",color:tx3}} title="Reset"><RotateCcw size={14}/></button>
        <button onClick={()=>setDark(d=>!d)} style={{padding:7,borderRadius:10,background:"none",border:"none",cursor:"pointer",color:dark?"#fbbf24":tx3}} title="Toggle dark mode">{dark?<Sun size={14}/>:<Moon size={14}/>}</button>
      </div>
    </div>
  );

  const ProgressBar=(
    <div style={{marginBottom:16}}>
      <div style={{height:5,borderRadius:99,background:dark?"#334155":"#e2e8f0",overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,#6366f1,#3b82f6)",width:`${progress}%`,transition:"width .7s ease-out"}}/></div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:11,color:tx3}}><span>Step {hist.length}</span><span>{progress}% complete</span></div>
    </div>
  );

  const MainContent=(
    <>
      {cQ==="result"
        ?<Result key={aKey} ans={ans} dark={dark} onReset={reset} hist={hist} onJump={handleJump} beginner={beginner}/>
        :<Question key={aKey} qId={cQ} ans={ans} onAns={(k,v)=>setAns(a=>({...a,[k]:v}))} onNext={handleNext} onPrev={handlePrev} isFirst={hist.length===1} animDir={aDir} dark={dark} beginner={beginner}/>
      }
      <p style={{textAlign:"center",fontSize:11,color:dark?"#475569":"#cbd5e1",marginTop:20}}>Based on APA &amp; Field (2018) statistical guidelines</p>
    </>
  );

  // Desktop sidebar content — test library overview
  const DesktopSidebar=(
    <div style={{width:280,flexShrink:0,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{borderRadius:16,padding:"16px 18px",background:dark?"#1e293b":"#fff",border:dark?"1.5px solid #334155":"1.5px solid #e2e8f0",boxShadow:dark?"none":"0 2px 12px rgba(0,0,0,.05)"}}>
        <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:dark?"#818cf8":"#6366f1",margin:"0 0 12px"}}>📚 Test Library</p>
        {[
          {cat:"Parametric",col:"#6366f1",bg:dark?"rgba(99,102,241,.12)":"#eef2ff",tests:["Welch's t-Test","Paired t-Test","One-Way ANOVA","Repeated Measures ANOVA","Pearson r","Simple Regression","Multiple Regression","Logistic Regression"]},
          {cat:"Non-Parametric",col:"#16a34a",bg:dark?"rgba(34,197,94,.1)":"#f0fdf4",tests:["Mann-Whitney U","Wilcoxon Signed-Rank","Kruskal-Wallis","Friedman Test","Spearman ρ","Kendall's τ-b","Chi-Square","Fisher's Exact","McNemar's","Cochran's Q"]},
          {cat:"Advanced",col:"#7c3aed",bg:dark?"rgba(139,92,246,.1)":"#f5f3ff",tests:["Mediation / Moderation","Point-Biserial r","Multinomial Logistic"]},
        ].map(({cat,col,bg,tests})=>(
          <div key={cat} style={{marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:col,flexShrink:0,display:"inline-block"}}/>
              <span style={{fontSize:10,fontWeight:700,color:col,textTransform:"uppercase",letterSpacing:".06em"}}>{cat}</span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"3px 4px"}}>
              {tests.map(t=><span key={t} style={{fontSize:10.5,padding:"2px 7px",borderRadius:6,background:bg,color:col,fontWeight:500}}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{borderRadius:16,padding:"16px 18px",background:dark?"#1e293b":"#fff",border:dark?"1.5px solid #334155":"1.5px solid #e2e8f0",boxShadow:dark?"none":"0 2px 12px rgba(0,0,0,.05)"}}>
        <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:dark?"#818cf8":"#6366f1",margin:"0 0 10px"}}>💡 {beginner?"Key Concepts":"Quick Tips"}</p>
        {(beginner?[
          ["Dependent Variable (DV)","The outcome you measure — the thing that might change. e.g. stress score, exam mark."],
          ["Independent Variable (IV)","The variable you think causes or predicts the outcome. e.g. gender, study hours."],
          ["p-value","p < .05 = statistically significant. Less than 5% chance the result is due to luck."],
          ["Effect Size","HOW BIG the finding is. Always report alongside p-value — size matters, not just significance."],
          ["Cronbach's Alpha","Reliability of your questionnaire. Report α before your main analysis. α > .70 is acceptable."],
        ]:[
          ["Normality","Check residuals AFTER running the model — not raw data."],
          ["Effect Size","Always report alongside p-values. p alone is not enough."],
          ["Post-hoc","Required after significant ANOVA / Kruskal-Wallis."],
          ["Power","Aim for .80 minimum; .90 is increasingly expected."],
          ["APA Style","Never write 'proves' — use 'suggests' or 'indicates'."],
        ]).map(([t,d])=>(
          <div key={t} style={{marginBottom:8,paddingBottom:8,borderBottom:dark?"1px solid #1e293b":"1px solid #f1f5f9"}}>
            <p style={{fontSize:11,fontWeight:700,color:dark?"#e2e8f0":"#1e293b",margin:"0 0 2px"}}>{t}</p>
            <p style={{fontSize:11,color:tx2,margin:0,lineHeight:1.5}}>{d}</p>
          </div>
        ))}
        <button onClick={()=>setShowGlossary(true)} style={{width:"100%",marginTop:4,padding:"8px 0",borderRadius:10,border:`1px solid ${dark?"#334155":"#e2e8f0"}`,background:"none",cursor:"pointer",fontSize:11.5,fontWeight:600,color:dark?"#818cf8":"#6366f1",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><HelpCircle size={12}/>Open glossary ({Object.keys(GLOSSARY).length} terms)</button>
      </div>
      <div style={{borderRadius:16,padding:"14px 18px",background:"linear-gradient(135deg,#6366f1,#3b82f6)",color:"#fff"}}>
        <p style={{fontSize:11,fontWeight:700,margin:"0 0 4px",opacity:.85,textTransform:"uppercase",letterSpacing:".06em"}}>Reference</p>
        <p style={{fontSize:11.5,margin:0,lineHeight:1.6,opacity:.9}}>Field, A. (2018). <em>Discovering Statistics Using IBM SPSS Statistics</em> (5th ed.). SAGE.</p>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:dark?"#0f172a":"linear-gradient(135deg,#f8faff,#eef2ff,#eff6ff)",transition:"background .3s"}}>
      {showGlossary&&<GlossaryModal dark={dark} onClose={()=>setShowGlossary(false)}/>}
      <style>{`
        @keyframes slideR{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
        @keyframes slideL{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
        .desktop-layout{display:none}
        .mobile-layout{display:block}
        @media(min-width:900px){
          .desktop-layout{display:flex}
          .mobile-layout{display:none}
        }
      `}</style>

      {/* ── MOBILE layout (unchanged) ── */}
      <div className="mobile-layout" style={{padding:"20px 16px 40px"}}>
        <div style={{maxWidth:540,margin:"0 auto"}}>
          {Header}
          {ProgressBar}
          {MainContent}
        </div>
      </div>

      {/* ── DESKTOP layout ── */}
      <div className="desktop-layout" style={{minHeight:"100vh",flexDirection:"column",padding:"28px 40px 40px"}}>
        {/* Top bar — full width */}
        <div style={{marginBottom:20}}>
          {Header}
          {ProgressBar}
        </div>
        {/* Two-column body */}
        <div style={{display:"flex",gap:28,alignItems:"flex-start",flex:1}}>
          {/* Left sidebar */}
          {DesktopSidebar}
          {/* Main panel */}
          <div style={{flex:1,minWidth:0,maxWidth:680}}>
            {MainContent}
          </div>
        </div>
      </div>
    </div>
  );
}