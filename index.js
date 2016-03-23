var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var File        = gutil.File;
var exec        = require('child_process').exec;
var fs          = require('fs');
var argv        = require('yargs').argv;

var PLUGIN_NAME = 'gulp-codedeploy';

module.exports = function (directory, opt) {

  'use strict';

  var group = argv.group;
  var description = argv.description;
  var uploadFileName = 'etc/gulp-codedeploy-push.tmp';
  var deployFileName = 'etc/gulp-codedeploy-deploy.tmp';
  var statusFileName = 'etc/gulp-codedeploy-status.tmp';

  if (!description) { 
    throw new PluginError(PLUGIN_NAME, "Must supply deployment description using the --description flag argument"); 
  }

  function getDeploymentId(file) {
    return new RegExp(/"deploymentId":\s("d-.*")/g).exec(fs.readFileSync(file, 'utf8'))[1];
  }

  function getDeploymentStatus(file) {
    return new RegExp(/"status":\s(".*")/g).exec(fs.readFileSync(file, 'utf8'))[1];
  }

  function getTag(file) {
    return new RegExp(/eTag="([^"]*)"/g).exec(fs.readFileSync(file, 'utf8'))[1];
  }


  // Create the command using an array and then join
  // This makes it easier to manage the string as a whole
  return new Promise( function (resolve, reject) {

    var uploadCommand = [
      'aws deploy push',
      '--application-name ' + opt.appName,
      '--s3-location s3://' + opt.bucket + '/' + opt.subdir + opt.fileName,
      '--description "' + description + '"',
      '--source ' + directory + ' > ' + uploadFileName
    ].join(' ');

    gutil.log("Executing: " + uploadCommand);

    exec(uploadCommand,
      function (err, stdout, stderr) {

        if (err) {
          throw new PluginError(PLUGIN_NAME, stderr);
        }

        gutil.log("Upload complete [etc/gulp-codedeploy-push.tmp created] (resolving promise)");
        resolve(stdout);
      }
    );
  })
  .then( function (response) {
    gutil.log(response);

    // Create the deployment
    createDeployment();
  })
  .catch( function (reason) {
    throw new PluginError(PLUGIN_NAME, reason);
  });
  


  function createDeployment() {
    // If the --production flag is present this will deploy the current
    // config into the 'production' group / else goes to development
    var groupName = (isProduction ? 'production' : 'development');

    // Parse the eTag from the file created by uploadDeployment
    var etag = getTag(uploadFileName);

    var deployCommand = [
      'aws deploy create-deployment ',
      '--application-name ' + opt.appName + ' ',
      '--s3-location bucket=' + opt.bucket + ',',
      'key=' + opt.subdir + opt.fileName + ',bundleType=zip,',
      'eTag="' + etag + '" ',
      '--deployment-config-name CodeDeployDefault.OneAtATime ',
      '--deployment-group-name ' + group + ' ',
      '--description "' + description + '" > ' + deployFileName,
    ].join('');

    gutil.log("Executing: " + deployCommand);

    return new Promise( function(resolve, reject) {
      // Execute the command and upon completion resolve the promise
      exec(deployCommand, 
        function(err, stdout, stderr) {

          if (err) {
            throw new PluginError(PLUGIN_NAME, stderr);
          }

          gutil.log("Deployment complete (resolving promise)");
          resolve(getDeploymentId(deployFileName));
        }
      );
    })
    .then( function(val) {
      gutil.log('Check status of deployment with - aws deploy get-deployment --deployment-id ' + val);
    })
    .catch( function(reason) {
      throw new PluginError(PLUGIN_NAME, reason);
    });
  }
};