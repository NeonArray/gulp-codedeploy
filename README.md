#gulp-codedeploy

To use, create a task and pass options

    gulp.task('deploy', function () {
        return deploy('dist', {
            appName: "app-name",
            bucket: "your-bucket-name",
            subdir: "if-any/",
            fileName: "file.zip"
        });
    });

Pass the description with the deploy task
`gulp deploy --description "Misc Updates"`