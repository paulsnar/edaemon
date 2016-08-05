define(function(require) {

  // var Change = require('change');

  var DeletedChange = Backbone.Model.extend({
    sync: function(method, model, options) {
      if (method === 'delete') {
        return $.ajax({
          method: 'POST',
          url: '/api/v1/trash',
          contentType: 'application/json',
          data: JSON.stringify({
            action: 'undelete',
            kind: 'Change',
            id: model.get('id')
          })
        });
      } else {
        return Backbone.sync(method, model, options);
      }
    }
  });
  var DeletedChanges = Backbone.Collection.extend({ model: DeletedChange });

  var DeletedChangeListItemView = Backbone.View.extend({
    events: {
      'click button[data-do="undelete"]': '_undelete'
    },

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.$el.find('button.disabled').removeClass('disabled');

      return this;
    },

    _undelete: function() {
      this.model.destroy();
    }
  });

  var DeletedChangeListView = Backbone.View.extend({
    emptyTemplate: [
      '<p class="text-muted text-center">',
        'Vairs nav dzēstu izmaiņu. Urā!',
      '</p>',
    ].join(''),

    initialize: function() {
      this.listenTo(this.collection, 'update', this._checkEmptiness);

      this.collection.forEach(function(change) {
        var $el = this.$el.find('[data-id="' + change.get('id') + '"]');
        var itemView = new DeletedChangeListItemView({
          el: $el[0],
          model: change
        }).render();
      }.bind(this));
    },

    _checkEmptiness: function() {
      if (this.collection.length === 0) {
        this.$el.html(this.emptyTemplate);
      }
    }
  });

  return {
    attach: function($target, dataItems) {
      var changes = new DeletedChanges(dataItems);
      new DeletedChangeListView({ el: $target[0], collection: changes }).render();
    }
  }

});
