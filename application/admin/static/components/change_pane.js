define(function(require) {

  var Change = require('models/change');

  var ChangePane = Backbone.View.extend({
    template: _.template([
      '<div class="alert alert-danger hidden" role=alert>Notika kļūda.</div>',
      '<div class="input-group">',
        '<span class="input-group-addon">Klase: </span>',
        '<input type="text" class="form-control"',
          '<% if (forClass) { %> value="<%- forClass %>" <% } %>',
          'data-input="for_class" />',
      '</div>',
      '<% if (!hideDate) { %>',
        '<div class="input-group">',
          '<span class="input-group-addon">Datums: </span>',
          '<input type="text" class="form-control"',
            '<% if (forDate) { %> value="<%- forDate %>" <% } %>',
            'data-input="for_date" />',
        '</div>',
      '<% } %>',
      '<% _.times(rows, function(row) { %>',
        '<div class="input-group">',
          '<span class="input-group-addon"><%= row %>.</span>',
          '<input type="text" class="form-control"',
            '<% if (rowValues) { %> value="<%- rowValues[row] %>" <% } %>',
            'data-input="row" data-for-row="<%= row %>" />',
        '</div>',
      '<% }) %>',
      '<% if (!fixedHeight) { %>',
        '<div class="input-group">',
          '<span class="input-group-addon">+.</span>',
          '<input type="text" class="form-control"',
            'data-input="row" data-for-row="_append" />',
        '</div>',
      '<% } %>',
    ].join(' ')),

    events: {
      'input input[data-input!="row"]': '_handleInput',
      'input input[data-input="row"]': '_handleRowInput',
      'focus input[data-input="row"][data-for-row="_append"]': '_appendRow'
    },

    initialize: function(options) {
      // this.optRows = options.rows;
      this.options = _.defaults(options, {
        fixedHeight: false,
        hideDate: false,
        surpressErrors: false
      });

      if (!this.model) {
        this.model = new Change();
      }

      if (!this.options.surpressErrors) {
        this.listenTo(this.model, 'invalid', this._showModelValidationError);
      }

      this.listenTo(this.model, 'error', this._showModelSyncError);
    },

    render: function() {
      var html = this.template({
        rows: this.options.fixedHeight ? 9 : this.model.get('lessons'),
        rowValues: this.model.toJSON().lessons,

        forClass: this.model.get('for_class'),
        forDate: this.model.get('for_date'),

        fixedHeight: this.options.fixedHeight,
        hideDate: this.options.hideDate,
      });

      this.$el.html(html);

      return this;
    },

    _showModelValidationError: function(model, error) {
      if (this.options.surpressErrors) return;
      this.$('div.alert[role="alert"]')
        .removeClass('hidden alert-warning')
        .addClass('alert-danger')
        .text(error);
    },

    _showModelSyncError: function(model, response) {
      // This kind of error is not surpressable.
      this.$('div.alert[role="alert"]')
        .removeClass('hidden alert-danger')
        .addClass('alert-warning')
        .text('Saglabāšanas laikā notika kļūda.');
    },

    _handleInput: function(e) {
      var $input = $(e.target);

      this.model.set($input.attr('data-input'), $input.val().trim());
    },

    _handleRowInput: function(e) {
      var $input = $(e.target);
      var row = parseInt($input.attr('data-for-row'), 10);

      if (isNaN(row)) return;

      var newValue = $input.val().trim();
      if (newValue === '') {
        newValue = null;
      }

      this.model.set('lesson_' + row, newValue);
    },

    _appendRow: function() {
      var rows = this.model.get('lessons');

      var $lastInput = this.$('[data-input="row"][data-for-row="_append"]');
      var $row = $lastInput.parent();

      var $newRow = $row.clone();
      $row.after($newRow);
      // $newRow.after($row);
      $lastInput.attr('data-for-row', rows);
      $lastInput.siblings('span').text((rows) + '.');

      this.model.set('lessons', this.model.get('lessons') + 1);
      this.model.set('lesson_' + rows, '');
    }
  });

  return ChangePane;

});
