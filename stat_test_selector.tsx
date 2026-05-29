import { useState } from "react";
import { ChevronRight, ChevronLeft, Moon, Sun, RotateCcw, Info, CheckCircle, Zap, Target, Users, TrendingUp, BarChart2, ArrowRight, AlertTriangle, BookOpen, GitBranch, Lightbulb, Copy, ChevronDown } from "lucide-react";

const TIPS = {
  continuous:"Numeric, any value in a range — e.g. test score, reaction time.",
  ordinal:"Ordered categories, unequal intervals — e.g. Likert 1–5.",
  categorical:"Distinct, unordered groups — e.g. nationality, condition.",
  binary:"Exactly two values — yes/no, pass/fail.",
  "independent samples":"Different participants in each group (between-subjects).",
  "paired samples":"Same participants measured twice — before/after.",
  "repeated measures":"Same participants measured 3+ times.",
  normality:"For t-tests and ANOVA, normality refers to the residuals — not the raw variable. With n>30, the Central Limit Theorem makes parametric tests robust.",
  mediation:"A mediator (M) explains the mechanism: X→M→Y.",
  "composite scale":"Built from multiple items (e.g. PHQ-9, GAD-7). When items are averaged with n>30, the result is treated as continuous — parametric tests are widely accepted (Norman, 2010).",
};
const BC={Parametric:["#ddd6fe","#3730a3"],"Non-Parametric":["#dcfce7","#166534"],Advanced:["#ede9fe","#581c87"]};

const T={
  independent_ttest:{n:"Independent Samples t-Test",e:"👥",b:"Parametric",c:95,tl:"Compare two separate groups on a continuous outcome",why:"Compares means between two independent, normally distributed groups — the gold standard for this design.",ass:["Continuous DV","Normal distribution per group (or n>30 by CLT)","Homogeneity of variance — Levene's test","Independent observations"],alt:{n:"Mann-Whitney U Test",w:"when normality is violated"},eff:"Cohen's d — small≥0.20, medium≥0.50, large≥0.80",ex:"Comparing mean anxiety (GAD-7) between a CBT group and a waitlist control.",viz:"Side-by-side box plots; bar chart with mean ± 95% CI",spss:"Analyze → Compare Means → Independent-Samples T Test",jmv:"T-Tests → Independent Samples T-Test"},
  paired_ttest:{n:"Paired Samples t-Test",e:"🔄",b:"Parametric",c:95,tl:"Track changes in the same participants over time",why:"Analyses difference scores within the same participants — more powerful than an independent t-test.",ass:["Continuous DV","Same participants at both time points","Difference scores approximately normal","No significant outliers in differences"],alt:{n:"Wilcoxon Signed-Rank Test",w:"when differences are non-normal"},eff:"Cohen's d from difference scores",ex:"PHQ-9 depression scores before vs. after a 12-week mindfulness programme.",viz:"Paired line plot; histogram of difference scores",spss:"Analyze → Compare Means → Paired-Samples T Test",jmv:"T-Tests → Paired Samples T-Test"},
  oneway_anova:{n:"One-Way ANOVA",e:"📊",b:"Parametric",c:93,tl:"Compare three or more independent groups",why:"Tests whether at least one group mean differs — protecting against inflated Type I error from multiple t-tests.",ass:["Continuous DV","Normality within each group","Homogeneity of variance (Levene's test)","Independent observations"],alt:{n:"Kruskal-Wallis Test",w:"when normality or equal variances are violated"},eff:"Eta-squared η² — small≥0.01, medium≥0.06, large≥0.14",ex:"Comparing wellbeing across lecture, flipped, and problem-based learning groups.",viz:"Box plots per group; means plot with 95% CI",ph:"Tukey HSD or Bonferroni; Games-Howell if variances differ",spss:"Analyze → Compare Means → One-Way ANOVA → Post Hoc",jmv:"ANOVA → One-Way ANOVA"},
  rm_anova:{n:"Repeated Measures ANOVA",e:"🔁",b:"Parametric",c:93,tl:"Track the same participants across 3+ time points",why:"Accounts for within-subject variance to dramatically increase power across 3+ conditions in the same sample.",ass:["Continuous DV","Sphericity — Mauchly's test (Greenhouse-Geisser if violated)","Approximately normal residuals"],alt:{n:"Friedman Test",w:"when sphericity or normality is violated"},eff:"Partial η²p or generalised η²G",ex:"Wellbeing at baseline, 3, 6, and 12 months post-intervention.",viz:"Line chart of means over time with SE bars",spss:"Analyze → General Linear Model → Repeated Measures",jmv:"ANOVA → Repeated Measures ANOVA"},
  mann_whitney:{n:"Mann-Whitney U Test",e:"🏅",b:"Non-Parametric",c:91,tl:"Compare two groups without assuming normality",why:"Your data doesn't quite fit the standard mould — Mann-Whitney compares rank distributions and is fully distribution-free.",ass:["Ordinal or continuous DV","Independent observations","Similar distribution shapes (for median comparison)"],alt:{n:"Independent Samples t-Test",w:"when normality and equal variances are met"},eff:"Rank-biserial r — small≥0.10, medium≥0.30, large≥0.50",ex:"Comparing Likert-scale job satisfaction (1–7) between two departments.",viz:"Box plots with median highlighted; violin plots",spss:"Analyze → Nonparametric Tests → Legacy Dialogs → 2 Independent Samples",jmv:"T-Tests → Independent Samples T-Test → check Mann-Whitney U"},
  wilcoxon:{n:"Wilcoxon Signed-Rank Test",e:"✍️",b:"Non-Parametric",c:90,tl:"Paired comparison without normality assumption",why:"Your paired data doesn't quite fit the standard mould — Wilcoxon uses ranks of difference scores; no distribution assumed.",ass:["Paired observations","Ordinal or continuous DV","Differences can be meaningfully ranked"],alt:{n:"Paired Samples t-Test",w:"when differences are normally distributed"},eff:"Matched-pairs rank-biserial r",ex:"Anxiety ratings (1–10) before and after a relaxation training workshop.",viz:"Pre/post median bar chart; dot plot of individual changes",spss:"Analyze → Nonparametric Tests → Legacy Dialogs → 2 Related Samples",jmv:"T-Tests → Paired Samples T-Test → check Wilcoxon signed rank"},
  kruskal_wallis:{n:"Kruskal-Wallis Test",e:"📈",b:"Non-Parametric",c:90,tl:"Compare 3+ independent groups without normality",why:"Your data doesn't fit the standard mould — Kruskal-Wallis uses rank-based comparisons across 3+ independent groups.",ass:["Ordinal or continuous DV","Independent observations","Similar distribution shapes"],alt:{n:"One-Way ANOVA",w:"when normality and equal variances are met"},eff:"ε² or η² from the H statistic",ex:"Self-reported stress across five different occupational groups.",viz:"Box plots per group; violin plots",ph:"Dunn's test with Bonferroni correction",spss:"Analyze → Nonparametric Tests → Legacy Dialogs → K Independent Samples",jmv:"ANOVA → One-Way ANOVA → check Kruskal-Wallis"},
  friedman:{n:"Friedman Test",e:"🌀",b:"Non-Parametric",c:89,tl:"Repeated measures without parametric assumptions",why:"Your data doesn't fit the standard mould — Friedman uses within-subject ranks across 3+ repeated conditions.",ass:["Same participants across all conditions","Ordinal or continuous DV","3+ conditions"],alt:{n:"Repeated Measures ANOVA",w:"when sphericity and normality are met"},eff:"Kendall's W (0=no agreement, 1=perfect)",ex:"Therapists rating CBT, DBT, and ACT effectiveness for shared clients.",viz:"Median rank line chart",ph:"Wilcoxon tests with Bonferroni correction",spss:"Analyze → Nonparametric Tests → Legacy Dialogs → K Related Samples",jmv:"ANOVA → Repeated Measures ANOVA → check Friedman"},
  pearson:{n:"Pearson Correlation (r)",e:"📉",b:"Parametric",c:96,tl:"Measure linear relationship between two continuous variables",why:"Both variables are continuous and approximately normal — Pearson r quantifies the strength and direction (−1 to +1) of the linear relationship.",ass:["Both variables continuous","Approximately bivariate normal","Linear relationship — check scatter plot","No significant outliers"],alt:{n:"Spearman's rho (ρ)",w:"when normality is violated or variables are ordinal"},eff:"r itself — small≥0.10, medium≥0.30, large≥0.50",ex:"Correlating weekly exercise hours with WEMWBS wellbeing scores.",viz:"Scatter plot with regression line and 95% confidence band",spss:"Analyze → Correlate → Bivariate → select Pearson",jmv:"Regression → Correlation Matrix → select Pearson's r"},
  spearman:{n:"Spearman's Rank Correlation (ρ)",e:"🔗",b:"Non-Parametric",c:93,tl:"Robust correlation for non-normal or ordinal data",why:"Your data doesn't quite fit the standard mould — Spearman uses ranks, is robust to outliers, and needs no normality.",ass:["Ordinal or continuous variables","Monotonic relationship — check scatter plot","No normality required"],alt:{n:"Pearson r",w:"when both variables are normally distributed and linearly related"},eff:"ρ itself — same benchmarks as Pearson r",ex:"Correlating Likert attachment anxiety scores with relationship satisfaction.",viz:"Scatter plot with Loess smoother",spss:"Analyze → Correlate → Bivariate → select Spearman",jmv:"Regression → Correlation Matrix → select Spearman's rho"},
  simple_regression:{n:"Simple Linear Regression",e:"📐",b:"Parametric",c:94,tl:"Predict a continuous outcome from one predictor",why:"Estimates the linear relationship between one predictor and a continuous outcome, quantifying change per unit of the predictor.",ass:["Linear relationship","Normal residuals (not the raw data)","Homoscedasticity","Independent observations"],alt:{n:"Spearman or non-linear regression",w:"when linearity or residual normality is violated"},eff:"R²; Cohen's f² — small≥0.02, medium≥0.15, large≥0.35",ex:"Predicting exam performance (%) from total study hours.",viz:"Scatter with regression line; residual-vs-fitted plot",spss:"Analyze → Regression → Linear (1 IV in 'Independents')",jmv:"Regression → Linear Regression"},
  multiple_regression:{n:"Multiple Linear Regression",e:"🔮",b:"Parametric",c:93,tl:"Predict a continuous outcome from multiple predictors",why:"Partials out each predictor's unique contribution while controlling for all others — essential when predictors correlate.",ass:["Linear relationships","Normal residuals","Homoscedasticity","No multicollinearity (VIF<10)","Independent observations"],alt:{n:"Ridge or Lasso regression",w:"when multicollinearity is severe"},eff:"R² (overall); standardised β per predictor; ΔR² per block",ex:"Predicting wellbeing from age, social support, and perceived stress simultaneously.",viz:"Coefficient plot; residuals vs. fitted",spss:"Analyze → Regression → Linear (all IVs in 'Independents')",jmv:"Regression → Linear Regression"},
  logistic_regression:{n:"Binary Logistic Regression",e:"⚖️",b:"Parametric",c:93,tl:"Predict the probability of a binary outcome",why:"Models log-odds of a binary outcome — handles categorical and continuous predictors while bounding predictions 0–1.",ass:["Binary DV","Log-odds linearity with continuous predictors","No multicollinearity","≥10 events per predictor","Independent observations"],alt:{n:"Probit regression or Decision Tree",w:"for alternative probability modelling"},eff:"Nagelkerke R²; Odds Ratios (OR); AUC-ROC",ex:"Predicting pass/fail from attendance rate, study hours, and prior GPA.",viz:"ROC curve; forest plot of odds ratios",spss:"Analyze → Regression → Binary Logistic",jmv:"Regression → Logistic Regression → Binomial"},
  multinomial_logistic:{n:"Multinomial Logistic Regression",e:"🗂️",b:"Parametric",c:90,tl:"Predict which of 3+ unordered categories",why:"Extends binary logistic regression to model all category probabilities simultaneously for a nominal outcome.",ass:["Nominal outcome with 3+ categories","No multicollinearity","Adequate sample per category"],alt:{n:"Ordinal logistic regression",w:"if categories have a meaningful order"},eff:"McFadden's R²; odds ratios per comparison",ex:"Predicting therapy preference (CBT, DBT, Person-Centred) from symptom profiles.",viz:"Probability bar charts; mosaic plot",spss:"Analyze → Regression → Multinomial Logistic",jmv:"Regression → Logistic Regression → Multinomial"},
  chi_square:{n:"Chi-Square Test (χ²)",e:"🔲",b:"Non-Parametric",c:92,tl:"Test association between two categorical variables",why:"Tests whether observed cell frequencies differ from independence expectations — no distribution assumption needed.",ass:["Both variables categorical","Independent observations","Expected cell frequencies ≥5","Random sampling"],alt:{n:"Fisher's Exact Test",w:"when any expected cell frequency is < 5"},eff:"Cramér's V — small≥0.10, medium≥0.30, large≥0.50",ex:"Gender × preference for face-to-face vs. online therapy.",viz:"Stacked bar chart; mosaic plot",spss:"Analyze → Descriptive Statistics → Crosstabs → Statistics → Chi-square",jmv:"Frequencies → Contingency Tables"},
  mediation_moderation:{n:"Mediation / Moderation Analysis",e:"🔀",b:"Advanced",c:88,tl:"Unpack how and when relationships occur",why:"Reveals mechanisms (mediation: X→M→Y) or boundary conditions (moderation: when does X→Y change?) behind relationships.",ass:["Causal ordering grounded in theory","Bootstrapping recommended (n≥200)","Measurement reliability across all variables"],alt:{n:"Structural Equation Modelling (SEM)",w:"for complex mediation chains or latent variables"},eff:"Mediation: indirect effect (a×b); Moderation: interaction coefficient β₃",ex:"Self-efficacy mediating social support → academic performance (Hayes, 2022).",viz:"Path diagram; interaction plot (Y vs X at levels of W)",sw:"PROCESS Macro v4 (Hayes, 2022) — most widely used in psychology.",spss:"Analyze → Regression → PROCESS v4 → Model 4 (mediation) or Model 1 (moderation)",jmv:"Install jAMM or PROCESS module from the jamovi library"},
};

const WR={
  independent_ttest:["An independent-samples t-test indicated that [DV] was significantly [higher/lower] for [Group 1] (M=___, SD=___) than [Group 2] (M=___, SD=___), t(___)=___, p=.___, d=___.","[Group 1] scored significantly [higher/lower] than [Group 2] on [DV]."],
  paired_ttest:["A paired-samples t-test revealed that [DV] significantly [increased/decreased] from [Time 1] (M=___, SD=___) to [Time 2] (M=___, SD=___), t(___)=___, p=.___, d=___.","[DV] changed significantly from [Time 1] to [Time 2]."],
  oneway_anova:["A one-way ANOVA indicated a significant effect of [IV] on [DV], F(___,___)=___, p=.___, η²=___. Post-hoc comparisons (Tukey HSD) showed [Group A] scored significantly [higher/lower] than [Group B] (p=.___, d=___).", "There was a significant difference in [DV] across the groups."],
  rm_anova:["A one-way repeated measures ANOVA indicated a significant effect of [time/condition] on [DV], F(___,___)=___, p=.___, η²p=___.","[DV] changed significantly across the [n] time points."],
  mann_whitney:["A Mann-Whitney U test indicated that [DV] differed significantly between [Group 1] (Mdn=___) and [Group 2] (Mdn=___), U=___, z=___, p=.___, r=___.","There was a significant difference between [Group 1] and [Group 2] on [DV]."],
  wilcoxon:["A Wilcoxon signed-rank test indicated that [DV] significantly [changed] from [Time 1] (Mdn=___) to [Time 2] (Mdn=___), z=___, p=.___, r=___.","[DV] changed significantly from [Time 1] to [Time 2]."],
  kruskal_wallis:["A Kruskal-Wallis test revealed a significant difference in [DV] across groups, H(___)=___, p=.___, ε²=___.","There was a significant difference in [DV] across the groups."],
  friedman:["A Friedman test indicated a significant difference in [DV] across conditions, χ²(___)=___, p=.___, W=___.","[DV] differed significantly across the conditions."],
  pearson:["A Pearson correlation revealed a significant [positive/negative] relationship between [Var 1] and [Var 2], r(___)=.___, p=.___.","There was a significant [positive/negative] relationship between [Var 1] and [Var 2]."],
  spearman:["A Spearman's rank-order correlation revealed a significant [positive/negative] relationship between [Var 1] and [Var 2], ρ(___)=.___, p=.___.","There was a significant [positive/negative] monotonic relationship between the variables."],
  simple_regression:["[Predictor] significantly predicted [DV], β=.___, t(___)=___, p=.___, R²=.___.","[Predictor] significantly predicted [DV], accounting for ___% of its variance."],
  multiple_regression:["Multiple regression indicated the model significantly predicted [DV], F(___,___)=___, p=.___, R²=___. [Predictor 1] (β=.___, p=___) and [Predictor 2] (β=.___, p=___) were significant predictors.","The predictors accounted for ___% of variance in [DV]."],
  logistic_regression:["Binary logistic regression indicated a significant model, χ²(___)=___, p=.___, Nagelkerke R²=___. [Predictor] significantly predicted [DV] (OR=___, 95% CI [___,___], p=___).", "[Predictor] significantly predicted the likelihood of [DV]."],
  multinomial_logistic:["Multinomial logistic regression predicted [DV]. [Predictor] significantly predicted [Category A] vs. [Reference] (OR=___, p=___).", "[Predictor] significantly predicted which [DV] category participants belonged to."],
  chi_square:["A chi-square test of independence indicated a significant association between [Var 1] and [Var 2], χ²(___)=___, p=.___, V=___.","There was a significant association between [Var 1] and [Var 2]."],
  mediation_moderation:["A mediation analysis using bootstrapping (5,000 samples; Hayes, 2022) indicated a significant indirect effect of [X] on [Y] through [M], b=.___, 95% CI [___,___].","[M] significantly mediated the relationship between [X] and [Y]."],
};

const GP={
  independent_ttest:"t-tests → Means: Two independent groups",
  paired_ttest:"t-tests → Means: Difference between two dependent means (matched pairs)",
  oneway_anova:"F-tests → ANOVA: Fixed effects, omnibus, one-way",
  rm_anova:"F-tests → ANOVA: Repeated measures, within factors",
  mann_whitney:"t-tests → Means: Two independent groups (no direct option — add ~15% to N)",
  wilcoxon:"t-tests → Means: Difference between two dependent means (add ~15% to N)",
  kruskal_wallis:"F-tests → ANOVA: Fixed effects, omnibus, one-way (add ~15% to N)",
  friedman:"F-tests → ANOVA: Repeated measures, within factors (add ~15% to N)",
  pearson:"Exact → Correlation: Bivariate normal model",
  spearman:"Exact → Correlation: Bivariate normal model (add ~15% to N)",
  simple_regression:"F-tests → Linear Multiple Regression: Fixed model, R² increase",
  multiple_regression:"F-tests → Linear Multiple Regression: Fixed model, R² increase",
  logistic_regression:"z-tests → Logistic regression",
  multinomial_logistic:"z-tests → Logistic regression (run per pairwise comparison)",
  chi_square:"χ²-tests → Goodness-of-fit tests: Contingency tables",
  mediation_moderation:"F-tests → Linear Multiple Regression (for paths). Use Monte Carlo tools for indirect effects.",
};
const GP_WARN={
  rm_anova:"⚠️ Change 'Corr among rep measures' from 0 to ~0.5 — the default of 0 severely underestimates your required N.",
  mediation_moderation:"⚠️ G*Power cannot compute power for indirect effects. Use the R package 'pwrss' or an online Monte Carlo calculator.",
};

function effectiveNorm(a){
  if(a.dvType==="likert"&&a.likertType==="single") return "nonnormal";
  const n=a.normN,r=a.normResult;
  if(!n||!r) return "unknown";
  if(n==="over100") return r==="nonnormal"?"nonnormal":"normal";
  if(n==="n30_100") return(r==="normal"||r==="roughly")?"normal":"nonnormal";
  return r==="normal"?"normal":"nonnormal";
}

function recommend(a){
  const ok=effectiveNorm(a)==="normal";
  if(a.objective==="association") return "chi_square";
  if(a.objective==="relationship"){if(a.relType==="mediation") return "mediation_moderation";return ok?"pearson":"spearman";}
  if(a.objective==="predict"){if(a.predDvType==="binary") return "logistic_regression";if(a.predDvType==="categorical") return "multinomial_logistic";return a.predIvCount==="one"?"simple_regression":"multiple_regression";}
  if(a.objective==="compare"){
    if(a.dvType==="binary"||a.dvType==="categorical") return "chi_square";
    if(a.design==="repeated") return ok?"rm_anova":"friedman";
    if(a.groups==="2"){if(a.design==="paired") return ok?"paired_ttest":"wilcoxon";return ok?"independent_ttest":"mann_whitney";}
    if(a.design==="paired") return ok?"rm_anova":"friedman";
    return ok?"oneway_anova":"kruskal_wallis";
  }
  return "pearson";
}

function nextQ(q,a){
  if(q==="objective"){if(a.objective==="compare") return "groups";if(a.objective==="relationship") return "rel_type";if(a.objective==="predict") return "pred_dv_type";return "result";}
  if(q==="groups") return "design";
  if(q==="design") return "dv_type";
  if(q==="dv_type"){if(a.dvType==="likert") return "likert_type";if(a.dvType==="continuous"||a.dvType==="ordinal") return "norm_n";return "result";}
  if(q==="likert_type") return a.likertType==="single"?"result":"norm_n";
  if(q==="rel_type") return a.relType==="two_continuous"?"norm_n":"result";
  if(q==="pred_dv_type") return a.predDvType==="continuous"?"pred_iv_count":"result";
  if(q==="pred_iv_count") return "result";
  if(q==="norm_n") return "norm_check";
  if(q==="norm_check") return "norm_result";
  if(q==="norm_result") return "result";
  return "result";
}

const QS={
  objective:{title:"What is your primary research objective?",sub:"This shapes your entire statistical strategy",Icon:Target,key:"objective",opts:[{id:"compare",label:"Compare groups or conditions",desc:'"Do men and women differ in stress levels?"',emoji:"⚖️"},{id:"relationship",label:"Explore a relationship between variables",desc:'"Is anxiety related to sleep quality?"',emoji:"🔗"},{id:"predict",label:"Predict an outcome variable",desc:'"What factors predict academic performance?"',emoji:"🎯"},{id:"association",label:"Test association between two categories",desc:'"Is gender linked to therapy preference?"',emoji:"🔲"}]},
  groups:{title:"How many groups are you comparing?",sub:"Count the distinct conditions in your study",Icon:Users,key:"groups",opts:[{id:"2",label:"Two groups",desc:"e.g. control vs. experimental, male vs. female",emoji:"2️⃣"},{id:"3plus",label:"Three or more groups",desc:"e.g. three treatment conditions, four age brackets",emoji:"3️⃣"}]},
  design:{title:"What is your study design?",sub:"How do participants relate to the conditions?",Icon:GitBranch,key:"design",opts:[{id:"independent",label:"Independent samples",desc:"Different participants in each group — between-subjects",emoji:"👥",tip:"independent samples"},{id:"paired",label:"Paired / matched (2 time points)",desc:"Same participants measured twice — pre/post design",emoji:"🔄",tip:"paired samples"},{id:"repeated",label:"Repeated measures (3+ time points)",desc:"Same participants measured across 3 or more conditions",emoji:"🔁",tip:"repeated measures"}]},
  dv_type:{title:"What type is your dependent variable?",sub:"The outcome you are measuring in your study",Icon:BarChart2,key:"dvType",opts:[{id:"continuous",label:"Continuous",desc:"Any numeric value — scores, times, measurements",emoji:"📏",tip:"continuous"},{id:"ordinal",label:"Ordinal",desc:"Ordered categories, unequal intervals — ranked data",emoji:"🏷️",tip:"ordinal"},{id:"likert",label:"Likert Scale (1–5 or 1–7)",desc:"Rating scale — e.g. anxiety, satisfaction, wellbeing items",emoji:"⭐"},{id:"binary",label:"Binary",desc:"Exactly two outcomes — yes/no, pass/fail",emoji:"🔘",tip:"binary"},{id:"categorical",label:"Categorical (3+ unordered groups)",desc:"Groups with no natural order — e.g. nationality",emoji:"🗂️",tip:"categorical"}]},
  likert_type:{title:"Is this a single item or a composite scale?",sub:"This determines which statistical approach is appropriate",info:"Single item (e.g. 'Rate your anxiety 1–5') → treat as ordinal → non-parametric recommended.\nComposite scale (e.g. PHQ-9, GAD-7, WEMWBS — items averaged) + n>30 → parametric is widely accepted (Norman, 2010).",Icon:Lightbulb,key:"likertType",opts:[{id:"single",label:"Single item",desc:"One rating question — e.g. 'Rate your satisfaction from 1 to 7'",emoji:"1️⃣"},{id:"multi",label:"Multi-item composite scale",desc:"Multiple items averaged or summed — e.g. PHQ-9, GAD-7, WEMWBS",emoji:"📋",tip:"composite scale"}]},
  rel_type:{title:"What kind of relationship are you examining?",sub:"Choose the analysis that best fits your question",Icon:TrendingUp,key:"relType",opts:[{id:"two_continuous",label:"Correlation between two continuous variables",desc:'"How does sleep duration relate to cognitive performance?"',emoji:"📉"},{id:"mediation",label:"Mediation or moderation analysis",desc:'"Does self-efficacy explain the stress–performance link?"',emoji:"🔀",tip:"mediation"}]},
  pred_dv_type:{title:"What type is your outcome (dependent) variable?",sub:"The variable you want to predict",Icon:Target,key:"predDvType",opts:[{id:"continuous",label:"Continuous",desc:"Numeric outcome — score, time, measurement",emoji:"📏",tip:"continuous"},{id:"binary",label:"Binary / Dichotomous",desc:"Two categories — pass/fail, recovered/not recovered",emoji:"🔘",tip:"binary"},{id:"categorical",label:"Categorical (3+ unordered categories)",desc:"Multiple groups — e.g. which therapy type chosen",emoji:"🗂️",tip:"categorical"}]},
  pred_iv_count:{title:"How many predictor variables do you have?",sub:"Independent variables entering your model",Icon:BookOpen,key:"predIvCount",opts:[{id:"one",label:"One predictor",desc:"A single independent variable in the model",emoji:"1️⃣"},{id:"multiple",label:"Two or more predictors",desc:"Multiple IVs examined simultaneously",emoji:"🔢"}]},
  norm_n:{title:"How many participants per group?",sub:"Don't worry if it's small — we'll find the right test for you",Icon:Users,key:"normN",opts:[{id:"under30",label:"Fewer than 30",desc:"Small sample — test selection matters more here",emoji:"🔍"},{id:"n30_100",label:"30 to 100",desc:"Medium sample — Central Limit Theorem starts helping",emoji:"📊"},{id:"over100",label:"More than 100",desc:"Large sample — CLT applies; parametric tests are robust",emoji:"📦"}]},
  norm_check:{title:"How did you assess normality?",sub:"Most psychology data isn't perfectly normal — here's how to decide what to do",Icon:Zap,key:"normCheck",opts:[{id:"shapiro",label:"Shapiro-Wilk test",desc:"Statistical test for normality",emoji:"🔬",tip:"normality"},{id:"qqplot",label:"Q-Q plot",desc:"Visual — points should follow the diagonal line",emoji:"📈"},{id:"histogram",label:"Histogram",desc:"Visual — should look roughly bell-shaped",emoji:"📊"},{id:"notchecked",label:"Haven't checked yet",desc:"That's okay — tell us what you expect to see",emoji:"❓"}]},
  norm_result:{title:"What does your data look like?",sub:"Your best assessment — minor deviations are very common in psychology",Icon:BarChart2,key:"normResult",opts:[{id:"normal",label:"Clearly normal",desc:"Bell-shaped, no obvious skew",emoji:"🔔"},{id:"roughly",label:"Roughly normal",desc:"Minor deviations — typical for most psychology data",emoji:"🔔"},{id:"nonnormal",label:"Skewed or non-normal",desc:"Clear skew, outliers, or normality test failed",emoji:"↗️"},{id:"unsure",label:"I'm not sure",desc:"We'll route you to the safer non-parametric option",emoji:"❓"}]},
};

const QID_TO_KEY={objective:"objective",groups:"groups",design:"design",dv_type:"dvType",likert_type:"likertType",rel_type:"relType",pred_dv_type:"predDvType",pred_iv_count:"predIvCount",norm_n:"normN",norm_check:"normCheck",norm_result:"normResult"};
const CM={objective:{compare:"Group comparison",relationship:"Relationship",predict:"Prediction",association:"Categorical assoc."},groups:{"2":"2 groups","3plus":"3+ groups"},design:{independent:"Independent",paired:"Paired",repeated:"Repeated"},dvType:{continuous:"Continuous DV",ordinal:"Ordinal DV",likert:"Likert DV",binary:"Binary DV",categorical:"Categorical DV"},likertType:{single:"Single item",multi:"Multi-item scale"},relType:{two_continuous:"2 continuous vars",mediation:"Mediation/Moderation"},predDvType:{continuous:"Continuous outcome",binary:"Binary outcome",categorical:"Categorical outcome"},predIvCount:{one:"1 predictor",multiple:"Multiple predictors"},normN:{under30:"n<30",n30_100:"n=30–100",over100:"n>100"},normCheck:{shapiro:"Shapiro-Wilk",qqplot:"Q-Q plot",histogram:"Histogram",notchecked:"Not checked"},normResult:{normal:"Normal",roughly:"~Normal",nonnormal:"Non-normal",unsure:"Unsure"}};

function methodsParagraph(a){
  const tk=recommend(a),tt=T[tk];
  if(!tt) return "";
  const nD={under30:"n<30",n30_100:"n=30–100",over100:"n>100"}[a.normN]||"";
  const chD={shapiro:"a Shapiro-Wilk test",qqplot:"Q-Q plot inspection",histogram:"histogram inspection",notchecked:"visual inspection"}[a.normCheck]||"";
  const nrD={normal:"appeared normally distributed",roughly:"appeared approximately normal",nonnormal:"appeared non-normally distributed",unsure:"was of uncertain normality"}[a.normResult]||"";
  let s=`The present study used the ${tt.n}`;
  if(a.objective==="compare") s+=` to compare [dependent variable] between ${a.groups==="2"?"two":"multiple"} ${a.design||"independent"} groups`;
  else if(a.objective==="relationship") s+=` to examine the relationship between [Variable 1] and [Variable 2]`;
  else if(a.objective==="predict") s+=` to predict [outcome variable] from [predictor(s)]`;
  else s+=` to test the association between [Variable 1] and [Variable 2]`;
  if(chD&&nrD) s+=`. Normality was assessed via ${chD}${nD?" ("+nD+")":""}, and data ${nrD}, supporting the use of ${effectiveNorm(a)==="normal"?"a parametric":"a non-parametric"} approach`;
  s+=`. The ${tt.n} was selected as appropriate for this research design.`;
  return s;
}

function Tip({term,dark}){
  const [s,setS]=useState(false);
  if(!TIPS[term]) return null;
  return(<span style={{position:"relative",display:"inline-flex"}}><button onMouseEnter={()=>setS(true)} onMouseLeave={()=>setS(false)} onClick={e=>{e.stopPropagation();setS(v=>!v)}} style={{background:"none",border:"none",cursor:"pointer",padding:"0 2px",color:"#818cf8",lineHeight:1}}><Info size={11}/></button>{s&&<span style={{position:"absolute",bottom:"calc(100% + 4px)",left:0,zIndex:99,width:185,fontSize:11,lineHeight:1.6,borderRadius:10,padding:"8px 10px",background:"#1e293b",color:"#e2e8f0",boxShadow:"0 8px 24px rgba(0,0,0,.25)",pointerEvents:"none"}}>{TIPS[term]}</span>}</span>);
}

function Opt({o,sel,onSel,dark}){
  return(<button onClick={()=>onSel(o.id)} style={{width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:14,border:sel?"2px solid #6366f1":`1.5px solid ${dark?"#334155":"#e2e8f0"}`,background:sel?(dark?"rgba(99,102,241,.15)":"rgba(99,102,241,.06)"):(dark?"#1e293b":"#fff"),cursor:"pointer",transition:"all .15s",boxShadow:sel?"0 0 0 3px rgba(99,102,241,.15)":"none"}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
      <span style={{fontSize:18,lineHeight:1,marginTop:2,flexShrink:0}}>{o.emoji}</span>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
          <span style={{fontWeight:600,fontSize:13,color:sel?(dark?"#a5b4fc":"#4338ca"):(dark?"#f1f5f9":"#1e293b")}}>{o.label}</span>
          {o.tip&&<Tip term={o.tip} dark={dark}/>}
          {sel&&<CheckCircle size={12} style={{color:"#6366f1",marginLeft:"auto",flexShrink:0}}/>}
        </div>
        <p style={{fontSize:11,margin:"2px 0 0",color:dark?"#64748b":"#94a3b8",lineHeight:1.5}}>{o.desc}</p>
      </div>
    </div>
  </button>);
}

function Ring({pct,dark}){
  const r=26,ci=2*Math.PI*r,fill=(pct/100)*ci;
  return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}><svg width="66" height="66" viewBox="0 0 66 66"><defs><linearGradient id="rg"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient></defs><circle cx="33" cy="33" r={r} fill="none" stroke={dark?"#334155":"#e2e8f0"} strokeWidth="6"/><circle cx="33" cy="33" r={r} fill="none" stroke="url(#rg)" strokeWidth="6" strokeDasharray={`${fill} ${ci}`} strokeDashoffset={ci/4} strokeLinecap="round"/><text x="33" y="38" textAnchor="middle" fontSize="13" fontWeight="700" fill={dark?"#c7d2fe":"#4338ca"}>{pct}%</text></svg><span style={{fontSize:10,fontWeight:500,color:dark?"#64748b":"#94a3b8",marginTop:-4}}>confidence</span></div>);
}

function Crumb({hist,ans,dark}){
  const tx3=dark?"#64748b":"#94a3b8";
  const chips=hist.filter(q=>q!=="result").map(qId=>{const k=QID_TO_KEY[qId];return k&&ans[k]&&CM[k]?.[ans[k]]?CM[k][ans[k]]:null;}).filter(Boolean);
  if(chips.length<2) return null;
  return(<div style={{marginBottom:14,padding:"8px 12px",borderRadius:12,background:dark?"rgba(99,102,241,.06)":"rgba(99,102,241,.04)",border:`1px solid ${dark?"rgba(99,102,241,.2)":"rgba(99,102,241,.12)"}`}}><div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"3px 5px"}}>{chips.map((c,i)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:11,fontWeight:500,color:dark?"#94a3b8":"#64748b",padding:"2px 7px",borderRadius:99,background:dark?"#334155":"#f1f5f9"}}>{c}</span>{i<chips.length-1&&<span style={{fontSize:10,color:tx3}}>→</span>}</span>))}</div></div>);
}

function Result({ans,dark,onReset,hist}){
  const [tab,setTab]=useState("why");
  const [swOpen,setSwOpen]=useState(null);
  const [copied,setCopied]=useState(null);
  const tk=recommend(ans),tt=T[tk];
  if(!tt) return null;
  const [bBg,bTx]=BC[tt.b]||["#e5e7eb","#374151"];
  const tx2=dark?"#94a3b8":"#475569",tx3=dark?"#64748b":"#94a3b8";
  const surf=dark?"rgba(255,255,255,.04)":"#f8fafc";
  const swWarn=ans.normCheck==="shapiro"&&ans.normN==="over100";
  const wrData=WR[tk];
  const TABS=[["why","Why?",Zap],["run","Run It",BookOpen],["wr","Write Up",Copy],["power","Power",TrendingUp],["ass","Assumptions",AlertTriangle]];
  const doCopy=(text,key)=>{navigator.clipboard?.writeText(text).catch(()=>{});setCopied(key);setTimeout(()=>setCopied(null),2200);};

  return(
    <div style={{animation:"fadeUp .4s ease-out both"}}>
      {swWarn&&<div style={{marginBottom:10,padding:"10px 14px",borderRadius:12,background:dark?"rgba(251,191,36,.1)":"#fefce8",border:`1.5px solid ${dark?"rgba(251,191,36,.3)":"#fde68a"}`}}><p style={{fontSize:12,fontWeight:600,color:dark?"#fbbf24":"#92400e",margin:0}}>⚠️ Shapiro-Wilk is oversensitive with n&gt;100 — it flags trivial deviations as significant. Check your Q-Q plot instead; if points roughly follow the diagonal, your data is fine for parametric tests.</p></div>}

      <div style={{borderRadius:20,padding:"20px 20px 16px",marginBottom:10,background:dark?"linear-gradient(135deg,rgba(67,56,202,.4),rgba(30,41,59,.95))":"linear-gradient(135deg,#eef2ff,#eff6ff)",border:dark?"1.5px solid rgba(99,102,241,.4)":"1.5px solid #c7d2fe"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><CheckCircle size={14} style={{color:"#22c55e"}}/><span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:"#22c55e"}}>Recommended Test</span></div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}><span style={{fontSize:24}}>{tt.e}</span><h2 style={{margin:0,fontSize:18,fontWeight:700,color:dark?"#f1f5f9":"#0f172a",lineHeight:1.2}}>{tt.n}</h2></div>
            <p style={{margin:"0 0 10px",fontSize:12.5,color:tx2}}>{tt.tl}</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}><span style={{padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,background:bBg,color:bTx}}>{tt.b}</span>{tt.ph&&<span style={{padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:600,background:dark?"#334155":"#fff",color:tx3,border:`1px solid ${dark?"#475569":"#e2e8f0"}`}}>Post-hoc needed</span>}</div>
          </div>
          <Ring pct={tt.c} dark={dark}/>
        </div>
        <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.07)"}`}}>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1,padding:"8px 10px",borderRadius:10,background:dark?"rgba(99,102,241,.15)":"rgba(99,102,241,.08)",border:`1px solid ${dark?"rgba(99,102,241,.3)":"rgba(99,102,241,.2)"}`}}><p style={{fontSize:10,fontWeight:700,color:dark?"#818cf8":"#4f46e5",margin:"0 0 2px"}}>✅ RECOMMENDED</p><p style={{fontSize:12,fontWeight:600,color:dark?"#e0e7ff":"#3730a3",margin:0}}>{tt.n}</p><p style={{fontSize:11,color:dark?"#818cf8":"#6366f1",margin:"2px 0 0"}}>More power when assumptions hold</p></div>
            <div style={{flex:1,padding:"8px 10px",borderRadius:10,background:surf,border:`1px solid ${dark?"#334155":"#e2e8f0"}`}}><p style={{fontSize:10,fontWeight:700,color:tx3,margin:"0 0 2px"}}>🔄 ALTERNATIVE</p><p style={{fontSize:12,fontWeight:600,color:dark?"#cbd5e1":"#374151",margin:0}}>{tt.alt.n}</p><p style={{fontSize:11,color:tx3,margin:"2px 0 0"}}>{tt.alt.w.charAt(0).toUpperCase()+tt.alt.w.slice(1)}</p></div>
          </div>
        </div>
      </div>

      <Crumb hist={hist} ans={ans} dark={dark}/>

      <div style={{borderRadius:20,overflow:"hidden",background:dark?"#1e293b":"#fff",border:dark?"1.5px solid #334155":"1.5px solid #e2e8f0",boxShadow:dark?"none":"0 4px 24px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",borderBottom:dark?"1px solid #334155":"1px solid #f1f5f9",overflowX:"auto"}}>
          {TABS.map(([id,lbl,Ic])=>(<button key={id} onClick={()=>setTab(id)} style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"12px 14px",fontSize:11,fontWeight:600,border:"none",cursor:"pointer",whiteSpace:"nowrap",borderBottom:tab===id?"2.5px solid #6366f1":"2.5px solid transparent",background:tab===id?(dark?"rgba(99,102,241,.12)":"rgba(99,102,241,.05)"):"transparent",color:tab===id?(dark?"#a5b4fc":"#4f46e5"):(dark?"#64748b":"#94a3b8"),transition:"all .15s"}}><Ic size={11}/>{lbl}</button>))}
        </div>

        <div style={{padding:"18px 20px"}}>
          {tab==="why"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:tx3,margin:"0 0 5px"}}>Why this test?</p><p style={{fontSize:13,lineHeight:1.7,color:tx2,margin:0}}>{tt.why}</p></div>
            <div style={{padding:"12px 14px",borderRadius:12,background:dark?"rgba(34,197,94,.07)":"#f0fdf4",border:`1px solid ${dark?"rgba(34,197,94,.18)":"#bbf7d0"}`}}><p style={{fontSize:10,fontWeight:700,color:dark?"#4ade80":"#15803d",margin:"0 0 4px"}}>💡 Example from psychology research</p><p style={{fontSize:13,lineHeight:1.7,color:dark?"#86efac":"#166534",margin:0}}>{tt.ex}</p></div>
            <div><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:tx3,margin:"0 0 5px"}}>Effect size</p><p style={{fontSize:13,color:tx2,margin:0}}>{tt.eff}</p></div>
            <div><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:tx3,margin:"0 0 5px"}}>Suggested visualisation</p><p style={{fontSize:13,color:tx2,margin:0}}>{tt.viz}</p></div>
            <div style={{padding:"11px 13px",borderRadius:12,background:dark?"rgba(251,191,36,.08)":"#fefce8",border:`1px solid ${dark?"rgba(251,191,36,.2)":"#fde68a"}`}}><p style={{fontSize:10,fontWeight:700,color:dark?"#fbbf24":"#92400e",margin:"0 0 3px",display:"flex",alignItems:"center",gap:3}}><ArrowRight size={10}/>Alternative test</p><p style={{fontSize:12.5,color:dark?"#fde68a":"#78350f",margin:0}}><strong>{tt.alt.n}</strong> — {tt.alt.w}</p></div>
            {tt.sw&&<div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(139,92,246,.1)":"#f5f3ff",border:`1px solid ${dark?"rgba(139,92,246,.25)":"#ddd6fe"}`}}><p style={{fontSize:11.5,color:dark?"#c4b5fd":"#5b21b6",margin:0}}>💡 <strong>Software tip:</strong> {tt.sw}</p></div>}
          </div>}

          {tab==="run"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}><p style={{fontSize:12,color:tx2,margin:0}}>Step-by-step for common software:</p><span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:dark?"rgba(34,197,94,.1)":"#f0fdf4",color:dark?"#4ade80":"#15803d",border:`1px solid ${dark?"rgba(34,197,94,.2)":"#bbf7d0"}`}}>jamovi &amp; JASP are free</span></div>
            {[["SPSS",tt.spss],["jamovi (free)",tt.jmv],["JASP (free)","Same pathway as jamovi. Open JASP, navigate to the equivalent test section, and move your variables across."]].map(([swName,step])=>(<div key={swName} style={{borderRadius:12,overflow:"hidden",border:`1px solid ${dark?"#334155":"#e2e8f0"}`}}><button onClick={()=>setSwOpen(swOpen===swName?null:swName)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:dark?"#0f172a":"#f8fafc",border:"none",cursor:"pointer",color:dark?"#f1f5f9":"#1e293b"}}><span style={{fontSize:12.5,fontWeight:600}}>{swName}</span><ChevronDown size={14} style={{transform:swOpen===swName?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}/></button>{swOpen===swName&&<div style={{padding:"10px 14px",background:dark?"#1e293b":"#fff"}}><p style={{fontSize:13,lineHeight:1.7,color:tx2,margin:0,background:dark?"#0f172a":"#f1f5f9",padding:"8px 10px",borderRadius:8,fontFamily:"monospace"}}>{step||"Refer to documentation."}</p></div>}</div>))}
          </div>}

          {tab==="wr"&&wrData&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{padding:"12px 14px",borderRadius:12,background:dark?"rgba(99,102,241,.08)":"#f5f3ff",border:`1px solid ${dark?"rgba(99,102,241,.2)":"#ddd6fe"}`}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:dark?"#a5b4fc":"#4f46e5",margin:0}}>APA 7th Edition Template</p><button onClick={()=>doCopy(wrData[0],"apa")} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:8,background:"none",border:`1px solid ${dark?"#475569":"#c7d2fe"}`,cursor:"pointer",fontSize:11,color:dark?"#818cf8":"#4f46e5"}}><Copy size={10}/>{copied==="apa"?"✓ Copied!":"Copy"}</button></div>
              <p style={{fontSize:13,lineHeight:1.8,color:tx2,margin:0,fontFamily:"Georgia,serif"}}>{wrData[0]}</p>
            </div>
            <div style={{padding:"12px 14px",borderRadius:12,background:dark?"rgba(34,197,94,.06)":"#f0fdf4",border:`1px solid ${dark?"rgba(34,197,94,.15)":"#bbf7d0"}`}}><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:dark?"#4ade80":"#15803d",margin:"0 0 5px"}}>In plain English</p><p style={{fontSize:13,lineHeight:1.7,color:dark?"#86efac":"#166534",margin:0}}>{wrData[1]}</p></div>
            <div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(251,191,36,.08)":"#fefce8",border:`1px solid ${dark?"rgba(251,191,36,.2)":"#fde68a"}`}}><p style={{fontSize:11.5,color:dark?"#fbbf24":"#92400e",margin:0}}>⚠️ Never write "proves" or "accepts H₀" — write "suggests", "indicates", or "failed to reject H₀" instead.</p></div>
          </div>}

          {tab==="power"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{padding:"12px 14px",borderRadius:12,background:dark?"rgba(99,102,241,.08)":"#f5f3ff",border:`1px solid ${dark?"rgba(99,102,241,.2)":"#ddd6fe"}`}}><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:dark?"#a5b4fc":"#4f46e5",margin:"0 0 6px"}}>G*Power path</p><p style={{fontSize:13,color:tx2,margin:0,fontFamily:"monospace",background:dark?"#0f172a":"#f1f5f9",padding:"8px 10px",borderRadius:8}}>{GP[tk]||"Check G*Power documentation."}</p></div>
            {GP_WARN[tk]&&<div style={{padding:"10px 12px",borderRadius:10,background:dark?"rgba(251,191,36,.08)":"#fefce8",border:`1px solid ${dark?"rgba(251,191,36,.2)":"#fde68a"}`}}><p style={{fontSize:12,color:dark?"#fbbf24":"#92400e",margin:0}}>{GP_WARN[tk]}</p></div>}
            <div style={{padding:"12px 14px",borderRadius:12,background:surf,border:`1px solid ${dark?"#334155":"#e2e8f0"}`}}><p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",color:tx3,margin:"0 0 6px"}}>Effect size for this test</p><p style={{fontSize:13,color:tx2,margin:0}}>{tt.eff}</p></div>
            <p style={{fontSize:11,color:tx3,margin:0,textAlign:"center"}}>G*Power is free — search "G*Power Faul 2007" to find the download.</p>
          </div>}

          {tab==="ass"&&<div>
            <p style={{fontSize:12.5,color:tx3,marginTop:0,marginBottom:12}}>Your data doesn't need to be perfect — check these before running your analysis:</p>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>{tt.ass.map((a,i)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"9px 11px",borderRadius:10,background:surf}}><span style={{width:18,height:18,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,marginTop:1,background:dark?"rgba(99,102,241,.25)":"#ede9fe",color:dark?"#a5b4fc":"#4f46e5"}}>{i+1}</span><p style={{fontSize:12.5,lineHeight:1.6,color:tx2,margin:0}}>{a}</p></div>))}</div>
            {tt.ph&&<div style={{marginTop:12,padding:"11px 13px",borderRadius:12,background:dark?"rgba(59,130,246,.08)":"#eff6ff",border:`1px solid ${dark?"rgba(59,130,246,.2)":"#bfdbfe"}`}}><p style={{fontSize:10,fontWeight:700,color:dark?"#60a5fa":"#1d4ed8",margin:"0 0 3px"}}>📋 Post-hoc tests required</p><p style={{fontSize:12.5,color:dark?"#93c5fd":"#1e40af",margin:0}}>{tt.ph}</p></div>}
          </div>}
        </div>
      </div>

      <button onClick={()=>doCopy(methodsParagraph(ans),"methods")} style={{width:"100%",marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"11px 0",borderRadius:14,fontSize:12.5,fontWeight:600,cursor:"pointer",border:`1px solid ${dark?"#334155":"#e2e8f0"}`,background:dark?"#1e293b":"#fff",color:tx2,transition:"all .15s"}}>
        <Copy size={13}/>{copied==="methods"?"✓ Copied to clipboard!":"Copy methods justification paragraph"}
      </button>
      <button onClick={onReset} style={{width:"100%",marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"11px 0",borderRadius:14,fontSize:12.5,fontWeight:600,cursor:"pointer",border:"none",background:dark?"#334155":"#f1f5f9",color:tx3,transition:"all .15s"}}>
        <RotateCcw size={13}/>Start a new analysis
      </button>
    </div>
  );
}

function Question({qId,ans,onAns,onNext,onPrev,isFirst,animDir,dark}){
  const q=QS[qId];
  if(!q) return null;
  const {Icon}=q,sel=ans[q.key];
  const tx3=dark?"#64748b":"#94a3b8";
  const swWarn=qId==="norm_result"&&ans.normCheck==="shapiro"&&ans.normN==="over100";
  return(
    <div style={{animation:`${animDir==="forward"?"slideR":"slideL"} .3s ease-out both`}}>
      <div style={{borderRadius:22,padding:"22px 20px",background:dark?"#1e293b":"#fff",border:dark?"1.5px solid #334155":"1.5px solid #e2e8f0",boxShadow:dark?"none":"0 4px 32px rgba(0,0,0,.07)"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:q.info||swWarn?12:16}}>
          <div style={{padding:9,borderRadius:11,flexShrink:0,background:dark?"rgba(99,102,241,.15)":"#eef2ff",color:dark?"#818cf8":"#4f46e5"}}><Icon size={17}/></div>
          <div><h2 style={{margin:0,fontSize:15.5,fontWeight:700,color:dark?"#f1f5f9":"#0f172a",lineHeight:1.3}}>{q.title}</h2><p style={{margin:"3px 0 0",fontSize:11,color:tx3}}>{q.sub}</p></div>
        </div>
        {q.info&&<div style={{marginBottom:14,padding:"10px 12px",borderRadius:12,background:dark?"rgba(99,102,241,.1)":"#f5f3ff",border:`1px solid ${dark?"rgba(99,102,241,.25)":"#ddd6fe"}`}}><p style={{fontSize:12,lineHeight:1.6,color:dark?"#c4b5fd":"#5b21b6",margin:0,whiteSpace:"pre-line"}}>💡 {q.info}</p></div>}
        {swWarn&&<div style={{marginBottom:14,padding:"10px 12px",borderRadius:12,background:dark?"rgba(251,191,36,.08)":"#fefce8",border:`1px solid ${dark?"rgba(251,191,36,.2)":"#fde68a"}`}}><p style={{fontSize:12,lineHeight:1.6,color:dark?"#fbbf24":"#92400e",margin:0}}>⚠️ Shapiro-Wilk is oversensitive with large samples (n&gt;100) — it may flag trivial deviations. Check your Q-Q plot instead; if points roughly follow the diagonal, parametric tests are fine.</p></div>}
        <div style={{display:"flex",flexDirection:"column",gap:7}}>{q.opts.map(o=><Opt key={o.id} o={o} sel={sel===o.id} onSel={v=>onAns(q.key,v)} dark={dark}/>)}</div>
        <div style={{display:"flex",gap:9,marginTop:16}}>
          <button onClick={onPrev} disabled={isFirst} style={{display:"flex",alignItems:"center",gap:4,padding:"10px 15px",borderRadius:11,fontSize:12.5,fontWeight:600,cursor:isFirst?"not-allowed":"pointer",border:"none",opacity:isFirst?.25:1,background:dark?"#334155":"#f1f5f9",color:tx3,transition:"all .15s"}}><ChevronLeft size={14}/>Back</button>
          <button onClick={onNext} disabled={!sel} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"10px 0",borderRadius:11,fontSize:13,fontWeight:700,border:"none",cursor:sel?"pointer":"not-allowed",transition:"all .15s",background:sel?"linear-gradient(135deg,#6366f1,#3b82f6)":"#e2e8f0",color:sel?"#fff":"#94a3b8",boxShadow:sel?"0 4px 14px rgba(99,102,241,.35)":"none"}}>Continue<ChevronRight size={14}/></button>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [dark,setDark]=useState(false);
  const [cQ,setCQ]=useState("objective");
  const [ans,setAns]=useState({});
  const [hist,setHist]=useState(["objective"]);
  const [aKey,setAKey]=useState(0);
  const [aDir,setADir]=useState("forward");
  const go=(dir,q)=>{setADir(dir);setAKey(k=>k+1);setCQ(q);};
  const handleNext=()=>{if(!ans[QS[cQ]?.key]) return;const nq=nextQ(cQ,ans);setHist(h=>[...h,nq]);go("forward",nq);};
  const handlePrev=()=>{if(hist.length<=1) return;const nh=hist.slice(0,-1);setHist(nh);go("backward",nh[nh.length-1]);};
  const reset=()=>{setAns({});setHist(["objective"]);go("forward","objective");};
  const progress=cQ==="result"?100:Math.min(90,Math.round((hist.length/9)*100));
  const tx1=dark?"#f1f5f9":"#0f172a",tx3=dark?"#64748b":"#94a3b8";
  return(
    <div style={{minHeight:"100vh",background:dark?"#0f172a":"linear-gradient(135deg,#f8faff,#eef2ff,#eff6ff)",transition:"background .3s",padding:"20px 16px 40px"}}>
      <style>{`@keyframes slideR{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}@keyframes slideL{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
      <div style={{maxWidth:540,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
              <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(99,102,241,.4)"}}><BarChart2 size={14} color="#fff"/></div>
              <span style={{fontSize:17,fontWeight:800,color:tx1}}>Stat<span style={{color:"#6366f1"}}>Test</span></span>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:999,fontWeight:700,letterSpacing:".06em",background:dark?"rgba(99,102,241,.2)":"#eef2ff",color:dark?"#818cf8":"#4f46e5"}}>SELECTOR</span>
            </div>
            <p style={{margin:0,fontSize:11,color:tx3,paddingLeft:38}}>For psychology &amp; social science students</p>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button onClick={reset} style={{padding:7,borderRadius:10,background:"none",border:"none",cursor:"pointer",color:tx3}} title="Reset"><RotateCcw size={14}/></button>
            <button onClick={()=>setDark(d=>!d)} style={{padding:7,borderRadius:10,background:"none",border:"none",cursor:"pointer",color:dark?"#fbbf24":tx3}} title="Toggle dark mode">{dark?<Sun size={14}/>:<Moon size={14}/>}</button>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{height:5,borderRadius:99,background:dark?"#334155":"#e2e8f0",overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:"linear-gradient(90deg,#6366f1,#3b82f6)",width:`${progress}%`,transition:"width .7s ease-out"}}/></div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:11,color:tx3}}><span>Step {hist.length}</span><span>{progress}% complete</span></div>
        </div>
        {hist.length>1&&<Crumb hist={hist} ans={ans} dark={dark}/>}
        {cQ==="result"
          ?<Result key={aKey} ans={ans} dark={dark} onReset={reset} hist={hist}/>
          :<Question key={aKey} qId={cQ} ans={ans} onAns={(k,v)=>setAns(a=>({...a,[k]:v}))} onNext={handleNext} onPrev={handlePrev} isFirst={hist.length===1} animDir={aDir} dark={dark}/>
        }
        <p style={{textAlign:"center",fontSize:11,color:dark?"#475569":"#cbd5e1",marginTop:20}}>Based on APA &amp; Field (2018) statistical guidelines</p>
      </div>
    </div>
  );
}
