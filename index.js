// nodejs build-in module
const fs = require('fs');
const path = require('path');

// npm third-party module
const shell = require('shelljs');
const chalk = require('chalk');
const svncmd = require('svn-interface');

// customized file
const config = require('./config.js');
const sourceCodePath = config.source.path;
const svnPath = config.svn.trunk;
const svnAllFiles = path.join(svnPath, '/*');

// set log oupout font color style
const logStyle = {
  success: chalk.bold.green,
  fail: chalk.bold.red,
  warn: chalk.bold.blue,
  info: chalk.bold.white
}

// set default svn commit message
const SVN_COMMIT_MESSAGE = config.svnCommitMessage || 'svn commit successfully.';

// detect svn
if (!shell.which('svn')) {
  shell.echo(logStyle.fail('Sorry, the tool requires svn. T_T'));
  shell.exit(1);
}

if (fs.existsSync('./config.js')) {
  // run svn update command
  svncmd.update(svnPath, function() {
      // copy source code to svn directory
      shell.cp('-R', sourceCodePath, svnPath);
      shell.echo(logStyle.success('copy source codes to svn folder successfully.'));
      // run svn add command
      svncmd.add(svnAllFiles, function() {
        // run svn commit command
        svncmd.commit(svnAllFiles, {'m': SVN_COMMIT_MESSAGE}, function() {
            shell.echo(logStyle.success('svn commit successfully.'))
        })
      });
  })
} else {
    shell.echo(logStyle.fail('Sorry, the tool requires config.js T_T'));
    shell.exit(1);
}