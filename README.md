#gulp-codedeploy
This plugin is designed to be used with Amazon Code Deploy. It works simply by executing command line statements for you.

To use, create a gulp task that calls the `deploy` function, passing your source folder and an options object containing your deployment configuration.

	  gulp.task('deploy', function () {
	    return deploy('dist', {
	      appName: "app-name",
	      bucket: "your-bucket-name",
	      subdir: "if-any/",
	      fileName: "file.zip"
	    });
	  });

Code Deploy deployments require a description. Right now I have it set up so you can pass a description when calling the gulp task, using a `--description` flag.

`gulp deploy --description "Misc Updates"`
