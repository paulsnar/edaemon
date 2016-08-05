define(function(require) {

  var Change = Backbone.Model.extend({
    /*
      normally contains props:
      {
        id: 'opaque base64 Google Urlsafe Key',
        for_date: '2016-05-05',
        for_class: '9.c',
        lessons: [ null, '1', '2', '3', '4', (etc...) ]
      }
    */

    urlRoot: '/api/v1/changes',

    validate: function(attrs, options) {
      if (attrs.for_class.trim() === '') {
        return 'Lūdzu ievadiet klasi.';
      }

      if (isNaN(Date.parse(attrs.for_date))) {
        return 'Datums bija ievadīts nepareizi. ' +
          'Datumam būtu jāseko formātam GGGG-MM-DD.';
      }
    }
  });

  return Change;

});
