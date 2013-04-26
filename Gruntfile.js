module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    qunit: {
      all: ['tests/*.html']
    },

    watch: {
      files: ['tests/*.js', 'tests/*.html', 'src/*.js'],
      tasks: ['qunit']
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['qunit']);

};