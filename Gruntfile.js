module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      target: ['lib/*.js', 'bin/*.js']
    },
    mochacli: {
     all: ["test/*Test.js"]
   },
   jsdoc : {
        dist : {
            src: ['lib/*'],
            options: {
                destination: 'dist/doc'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['eslint', 'mochacli','jsdoc']);
};
