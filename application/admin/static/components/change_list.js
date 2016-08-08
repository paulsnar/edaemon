define(function(require) {

  var Change = require('models/change');
  var Changes = Backbone.Collection.extend({ model: Change });

  var ConfirmActionButton = require('components/confirm_action_button');

  var ChangeListItemView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);

      var cab = new ConfirmActionButton({
        el: this.$el.find('button[data-do="delete"]') });
      this.listenTo(cab, 'action', this._delete);
    },

    render: function() {
      // Since we only rehydrate server-rendered views with a couple of events,
      // this removes cosmetics which signal that the view is not rendered.
      // We don't really perform any replacement of elements.
      this.$el.find('button.disabled').removeClass('disabled');

      return this;
    },

    _delete: function() {
      this.model.destroy();
    }
  });

  var ChangeListView = Backbone.View.extend({
    emptyTemplate: [
      '<p class="text-muted">',
        'Vairs nav izmaiņu.',
      '</p>',
    ].join(''),

    initialize: function() {
      this.listenTo(this.collection, 'update', this._checkEmptiness);
    },

    render: function() {
      this.collection.forEach(function(change) {
        var $el = this.$('[data-id="' + change.get('id') + '"]');
        var view = new ChangeListItemView({
          el: $el[0],
          model: change
        });
        view.render();
      });
    },

    _checkEmptiness: function() {
      if (this.collection.length === 0) {
        var $newEl = $('<div>');
        this.el = $newEl[0];
        this.$el.replaceWith(this.el);
        this.$el = $(this.el);

        this.$el.html(this.emptyTemplate);
      }
    }
  });

  return {
    attach: function($target, dataItems) {
      var changes = new Changes(dataItems);
      new ChangeListView({ el: $target[0], collection: changes }).render();
    }
  }

});
