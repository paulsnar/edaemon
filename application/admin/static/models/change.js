define(function(require) {

  var Change = Backbone.Model.extend({
    /*
      normally contains props:
      {
        id: 'opaque base64 Google Urlsafe Key',
        for_date: '2016-05-05',
        for_class: '9.c',
        lessons: (int),
        lesson_0, lesson_1, lesson_..., lesson_(lessons - 1): (str)
      }
    */

    urlRoot: '/api/v1/changes',

    defaults: (function() {
      var defaults = {
        for_date: (new Date()).toISOString().substr(0,10),
        for_class: '',
        lessons: 5
      };

      _.times(defaults.lessons, function(lesson) {
        defaults['lesson_' + lesson] = null;
      });

      return defaults;
    })(),

    initialize: function() {
      if (_.isArray(this.get('lessons'))) {
        var lessons = this.get('lessons');
        var attrs = {
          lessons: lessons.length
        }
        _.forEach(lessons, function(lesson, i) {
          attrs['lesson_' + i] = lesson;
        });
        this.set(attrs);
      }
    },

    getLessons: function() {
      var lessonsObj = _.pickBy(this.attributes,
        function(val, key) { return _.startsWith(key, 'lesson_') });
      var lessons = [ ];
      _.forEach(lessonsObj, function(lesson, key) {
        lessons[parseInt(key.substr(7), 10)] = lesson;
      });
      return lessons;
    },

    toJSON: function(options) {
      var useKeys = _(this.attributes)
        .keys()
        .reject(function(key) { return _.startsWith(key, 'lesson'); })
        .value();
      var repr = _.pick(this.attributes, useKeys);
      repr.lessons = [ ];
      _.times(this.attributes.lessons, function(lesson) {
        repr.lessons.push(this.attributes['lesson_' + lesson]);
      }.bind(this));

      return repr;
    },

    validate: function(attrs, options) {
      if (attrs.for_class.trim() === '') {
        return 'Lūdzu ievadiet klasi.';
      }

      if (!/\d{4}-\d{2}-\d{2}/.test(attrs.for_date)) {
        return 'Datums bija ievadīts nepareizi. ' +
          'Datumam būtu jāseko formātam GGGG-MM-DD.';
      }
    },

    isEmpty: function() {
      // A change is considered empty if it has no lessons filled in.
      // This is intended for allowing to have nicely lined up rows
      // for /changes/new, yet allowing them to be empty.

      var lessons = this.getLessons();

      return _.every(lessons, function(i) { return i === null || i === ''; });
    }
  });

  return Change;

});
