define(function(require) {
  var Keys = require('utils/keys');

  var Change = require('models/change');
  var Changes = Backbone.Collection.extend({ model: Change });

  var ChangePane = require('components/change_pane');

  var ChangeAddView = Backbone.View.extend({

    template: _.template([
      '<div class="alert alert-danger hidden">Notika kļūda.</div>',
      '<div class="row">',
        '<div class="col-md-3 form-inline">',
          '<div class="input-group">',
            '<span class="input-group-addon">Datums: </span>',
            '<input type="date" class="form-control"',
              'placeholder="GGGG-MM-DD" />',
          '</div>',
        '</div>',
      '</div>',
      '<div class="row" data-columns></div>',
      '<p>',
        '<button class="btn btn-primary" data-do="save">',
          '<span class="glyphicon glyphicon-floppy-disk"></span>',
          'Saglabāt',
        '</button>',
      '</p>',
    ].join(' ')),

    _appendColumnButtonTemplate: [
      '<button class="btn btn-default btn-lg btn-block"',
        'data-do="append_column">',
        '<span class="glyphicon glyphicon-plus"></span>',
      '</button>',
    ].join(' '),

    events: {
      'click [data-do="save"]': '_save',
      'keyup': '_conditionalSave',
      'click [data-do="append_column"]': '_addChange',
    },

    _conditionalSave: function(e) {
      if (e.key === 'Enter' ||
          e.which === Keys.ENTER) {
        this._save();
      }
    },

    _save: function() {
      var $dateField = this.$('input[type="date"]');
      var date = $dateField.val().trim();
      if (!/\d{4}-\d{2}-\d{2}/.test(date)) {
        this.$el.children('div.alert.alert-danger')
          .text('Nepareizs datums.')
          .removeClass('hidden');
        return;
      } else {
        this.$el.children('div.alert.alert-danger')
          .addClass('hidden');
      }

      this.collection.forEach(function(model) {
        model.set('for_date', date);
        if (!model.isEmpty()) {
          model.save();
        }
      }.bind(this));

      // in case if everything's empty (yet the date's filled out?)
      this._handleSync();
    },

    _addChange: function() {
      var size = this.options.fixedHeight ? 9 : 6;
      var data = { };

      _.fill(new Array(size), null).map(function(val, i) {
        data['lesson_' + i] = val;
      });
      data['lessons'] = size;

      var $dateField = this.$('input[type="date"]');
      if ($dateField.length === 0) {
        // not rendered yet!
        data['for_date'] = '';
      } else {
        data['for_date'] = this.$('input[type="date"]').val().trim();
      }

      this.collection.add(data);
    },

    initialize: function(options) {
      this.options = _.defaults(options, {
        cozyMode: false,
        fixedHeight: false
      });

      if (!this.collection) {
        this.collection = new Changes();
        this._addChange();
      }

      this.listenTo(this.collection, 'add', this._appendColumn);
      this.listenTo(this.collection, 'sync', this._handleSync);
    },

    render: function() {
      var html = this.template(
        _.pick(this.options, 'cozyMode')
      );
      this.$el.html(html);

      var itemsPerRow = this.options.cozyMode ? 6 : 4;

      var rows = Math.ceil(this.collection.length / itemsPerRow);

      this.collection.forEach(function(item, index) {
        this._appendColumn(item);
      }.bind(this));

      if (this.collection.length % itemsPerRow === 0) {
        this.$('div.row[data-columns]').last().after(
          $('<div>')
            .addClass('row')
            .attr('data-columns', '')
        );
      }

      this.$('div.row').last().append(
        $('<div>')
          .addClass('col-md-' + (this.options.cozyMode ? '2' : '3'))
          .html(this._appendColumnButtonTemplate)
      );

      return this;
    },

    _appendColumn: function(change) {
      var itemsPerRow = this.options.cozyMode ? 6 : 4;
      var $lastRow = this.$('div.row[data-columns]').last();

      if ($lastRow.find('div:not(:has(button))').length === itemsPerRow) {
        var $newRow = $('<div>')
            .addClass('row')
            .attr('data-columns', '');
        $lastRow.after($newRow);
        $lastRow = $newRow;
      } else {
        var $appendBtnCol = $lastRow.children('div:has(button)');
        if ($lastRow.children('div:not(:has(button))').length === itemsPerRow - 1) {
          var $newRow = $('<div>')
            .addClass('row')
            .attr('data-columns', '');
          $newRow.append($appendBtnCol);
          $lastRow.after($newRow);
        }
        var pane = new ChangePane({
          model: change,

          fixedHeight: this.options.fixedHeight,
          hideDate: true
        }).render();
        $(pane.el).addClass('col-md-' + (this.options.cozyMode ? '2' : '3'));
        $lastRow.append(pane.el);
        if ($lastRow.children('div:not(:has(button))').length !== itemsPerRow) {
          $lastRow.append($appendBtnCol);
        }
      }

    },

    _handleSync: function(model) {
      var allSynced = _.every(
        this.collection.filter(function(model) { return !model.isEmpty(); }),
        function(model) { return !model.isNew(); }
      );

      if (allSynced) {
        window.location.assign('/admin/changes/all');
      }
    }

  });

  return ChangeAddView;
});
