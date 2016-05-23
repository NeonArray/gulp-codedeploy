#gulp-codedeploy
This plugin is designed to be used with Amazon Code Deploy. It works simply by executing command line statements for you.

You will need to have the AWS CLI installed, along with your credentials stored globally, in order
for this plugin to work.

To use, create a gulp task that calls the `deploy` function, passing your source folder and an options object containing your deployment configuration.

    gulp.task('deploy', function () {
        appName: "AppName",
        bucket: "myBucket",
        source: 'dist',
        subdir: "app-subdirectory",
        fileName: "file.zip",
        deploymentGroup: "development",
        defaultDescription: "A description of the push",
        deployConfig: "CodeDeployDefault.OneAtATime"
    });

