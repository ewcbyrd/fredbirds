#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const chokidar = require('chokidar');

const packageJsonPath = path.join(__dirname, '../package.json');
const srcPath = path.join(__dirname, '../src');

function incrementVersion() {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;
    const versionParts = currentVersion.split('.');
    const patch = parseInt(versionParts[2]) + 1;
    const newVersion = `${versionParts[0]}.${versionParts[1]}.${patch}`;
    
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log(`Version incremented from ${currentVersion} to ${newVersion}`);
    return newVersion;
}

function runBuild() {
    return new Promise((resolve, reject) => {
        console.log('Running build...');
        exec('npm run build', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
            if (error) {
                console.error('Build failed:', error);
                reject(error);
            } else {
                console.log('Build completed successfully');
                console.log(stdout);
                resolve();
            }
        });
    });
}

async function handleFileChange(filePath) {
    try {
        console.log(`File changed: ${filePath}`);
        const newVersion = incrementVersion();
        await runBuild();
        console.log(`Auto-build complete for version ${newVersion}`);
    } catch (error) {
        console.error('Auto-build failed:', error);
    }
}

const watcher = chokidar.watch(srcPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true
});

watcher
    .on('change', handleFileChange)
    .on('add', handleFileChange)
    .on('unlink', (path) => console.log(`File ${path} has been removed`));

console.log(`Watching ${srcPath} for changes...`);
console.log('Press Ctrl+C to stop watching');

process.on('SIGINT', () => {
    console.log('\nStopping file watcher...');
    watcher.close();
    process.exit(0);
});