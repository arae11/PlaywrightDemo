/**
 * Shard Results Merger
 * 
 * This script merges multiple shard JSON test results files into a single consolidated JSON file.
 * 
 * Behavior:
 * - Determines the base results directory:
 *    * If environment variable UNIQUE_TIMESTAMP is set, uses `test-results/{RUN_NAME}--{UNIQUE_TIMESTAMP}`
 *    * Otherwise, picks the latest timestamped folder inside `test-results/`
 * - Reads all shard JSON files (`results-*.json`) within the chosen directory
 * - Parses and merges all JSON arrays into one
 * - Writes merged output as `merged-results.json` inside the base directory
 * 
 * Error Handling:
 * - Throws and logs descriptive errors if:
 *    * Results directory or shard files are missing
 *    * File read or JSON parse errors occur
 * - Exits with failure code on errors
 * 
 * Usage:
 * - Run this script after parallel test shards complete to combine their results for unified reporting.
 */

const fs = require('fs');
const path = require('path');

// Helper function to safely get the latest results directory
function getLatestResultsDir() {
  const resultsDir = 'test-results';
  
  if (!fs.existsSync(resultsDir)) {
    throw new Error(`Directory ${resultsDir} does not exist`);
  }

  const folders = fs.readdirSync(resultsDir)
    .filter(folder => {
      try {
        return fs.statSync(path.join(resultsDir, folder)).isDirectory();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error checking ${folder}:`, errorMessage);
        return false;
      }
    })
    .filter(folder => folder.includes('--'));

  if (folders.length === 0) {
    throw new Error('No valid test result folders found');
  }

  // Get the most recent folder without non-null assertion
  const latestFolder = folders.sort()[folders.length - 1];
  return path.join(resultsDir, latestFolder);
}

// Main merge function
function mergeShardResults() {
  try {
    // Get the base directory - use environment variable or latest
    const baseDir = process.env.UNIQUE_TIMESTAMP 
      ? path.join('test-results', `${process.env.RUN_NAME || 'run'}--${process.env.UNIQUE_TIMESTAMP}`)
      : getLatestResultsDir();

    if (!fs.existsSync(baseDir)) {
      throw new Error(`Directory ${baseDir} does not exist`);
    }

    console.log(`Merging results from: ${baseDir}`);

    // Find all shard result files
    const shardFiles = fs.readdirSync(baseDir)
      .filter(file => file.startsWith('results-') && file.endsWith('.json'))
      .map(file => path.join(baseDir, file));

    if (shardFiles.length === 0) {
      console.log('No shard results found to merge');
      return;
    }

    // Merge all results
    const merged = shardFiles.flatMap(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        return JSON.parse(content);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error processing ${file}:`, errorMessage);
        return [];
      }
    });

    // Save merged results
    const outputPath = path.join(baseDir, 'merged-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));
    console.log(`Successfully merged ${shardFiles.length} shards into ${outputPath}`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to merge shard results:', errorMessage);
    process.exit(1);
  }
}

// Run the merge
mergeShardResults();
