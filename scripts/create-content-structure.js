const fs = require('fs');
const path = require('path');

// Base content directory in public folder
const CONTENT_DIR = path.join(process.cwd(), 'public', 'content');

// Create the public directory if it doesn't exist
const PUBLIC_DIR = path.join(process.cwd(), 'public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR);
  console.log('Created public directory');
}

// Create the content directory if it doesn't exist
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR);
  console.log('Created content directory in public folder');
}

// Check if content already exists
const contentFiles = fs.readdirSync(CONTENT_DIR);
if (contentFiles.length > 0) {
  console.log('Content directory already has files. Skipping sample content creation.');
  console.log('If you want to recreate the sample content, please empty the public/content directory first.');
  process.exit(0);
}

// Create unit directories
const units = [
  'unit1',
  'unit2',
  'unit3',
  'unit4',
  'unit5',
  'unit6',
  'unit7',
  'unit8',
  'unit9',
];

units.forEach(unit => {
  const unitPath = path.join(CONTENT_DIR, unit);
  if (!fs.existsSync(unitPath)) {
    fs.mkdirSync(unitPath);
    console.log(`Created ${unit} directory`);
  }
});

// Create 2017 AP Exam directory
const apExamPath = path.join(CONTENT_DIR, '2017apexam');
if (!fs.existsSync(apExamPath)) {
  fs.mkdirSync(apExamPath);
  console.log('Created 2017apexam directory');
}

// Create a sample quiz directory structure in unit1
const sampleQuizPath = path.join(CONTENT_DIR, 'unit1', '1-2');
if (!fs.existsSync(sampleQuizPath)) {
  fs.mkdirSync(sampleQuizPath);
  console.log('Created sample quiz directory: unit1/1-2');
  
  // Create a sample prompt file
  const samplePromptContent = `# AP Statistics Quiz 1-2 Prompt

Use this prompt with an AI assistant like Claude or ChatGPT to get help with this quiz.

## Instructions for the AI

You are a helpful AP Statistics tutor. The student is working on Quiz 1-2 which covers:
- Displaying quantitative data with graphs
- Describing distributions
- The normal distribution

Please help the student understand these concepts and solve problems related to them.

## Student Questions

1. What are the key features to look for when describing a distribution?
2. How do I identify the shape, center, and spread of a distribution from a histogram?
3. What's the difference between a box plot and a histogram?
4. How do I calculate z-scores and use them to find probabilities?`;

  fs.writeFileSync(
    path.join(sampleQuizPath, 'prompt.txt'),
    samplePromptContent
  );
  console.log('Created sample prompt file: unit1/1-2/prompt.txt');
}

// Create a sample knowledge tree file
const knowledgeTreePath = path.join(CONTENT_DIR, 'knowledge-tree.txt');
if (!fs.existsSync(knowledgeTreePath)) {
  const knowledgeTreeContent = `# AP Statistics Knowledge Tree

## Unit 1: Exploring One-Variable Data
├ 1.1 Variables and Data
├ 1.2 Representing Data with Graphs
├ 1.3 Describing Distributions
├ 1.4 Summary Statistics
├ 1.5 The Normal Distribution
└ 1.6 Comparing Distributions

## Unit 2: Exploring Two-Variable Data
├ 2.1 Scatterplots
├ 2.2 Correlation
├ 2.3 Least-Squares Regression
├ 2.4 Residuals
├ 2.5 Non-Linear Relationships
└ 2.6 Categorical Data and Two-Way Tables

## Unit 3: Collecting Data
├ 3.1 Introduction to Planning a Study
├ 3.2 Random Sampling and Data Collection
├ 3.3 Experimental Design
└ 3.4 Sampling Methods

## Unit 4: Probability, Random Variables, and Probability Distributions
├ 4.1 Introduction to Probability
├ 4.2 Probability Rules
├ 4.3 Conditional Probability
├ 4.4 Random Variables and Probability Distributions
├ 4.5 Binomial and Geometric Distributions
└ 4.6 Transforming Random Variables

## Unit 5: Sampling Distributions
├ 5.1 Introduction to Sampling Distributions
├ 5.2 Sample Proportions
└ 5.3 Sample Means

## Unit 6: Inference for Categorical Data: Proportions
├ 6.1 Confidence Intervals for Proportions
├ 6.2 Hypothesis Testing for Proportions
├ 6.3 Comparing Two Proportions
└ 6.4 Chi-Square Tests

## Unit 7: Inference for Quantitative Data: Means
├ 7.1 t-Distribution
├ 7.2 Confidence Intervals for Means
├ 7.3 Hypothesis Testing for Means
└ 7.4 Comparing Two Means

## Unit 8: Inference for Categorical Data: Chi-Square
├ 8.1 Chi-Square Tests for Goodness of Fit
├ 8.2 Chi-Square Tests for Independence
└ 8.3 Chi-Square Tests for Homogeneity

## Unit 9: Inference for Quantitative Data: Slopes
├ 9.1 Confidence Intervals for Slopes
└ 9.2 Hypothesis Testing for Slopes`;

  fs.writeFileSync(knowledgeTreePath, knowledgeTreeContent);
  console.log('Created sample knowledge tree file');
}

console.log('\nContent directory structure created successfully!');
console.log('\nNext steps:');
console.log('1. Add your PDF files to the appropriate directories in public/content');
console.log('2. Create prompt.txt files for each quiz');
console.log('3. Add any images you want to display');
console.log('4. Run the application with: npm run dev'); 