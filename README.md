#gulp-codedeploy

To use, create a task and pass options

    gulp.task('deploy', function () {
        return deploy('dist', {
            appName: "app-name",
            bucket: "your-bucket-name",
            subdir: "if-any/",
            fileName: "file-v" + pkg.version + ".zip"
        });
    });

Then in the command line you must pass a description with the task
`gulp deploy --description "Misc Updates"`