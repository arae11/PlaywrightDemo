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
