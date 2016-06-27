import DS from 'ember-data';
import config from 'ember-get-config';

const {$} = Ember;

// The WP API requires a rest adapter.
export default DS.RESTAdapter.extend({
	host: config.wordpressHost,
	// This is the default namespace for WP API v2.
	namespace: 'wp-json/wp/v2',

	handleResponse(status, headers, payload, requestData) {
		// Wordpress sends meta data (useful for pagination) in GET requests headers.
		// Here we move it to a `meta` property which Ember expects.
		if (payload) {
			const meta = {
				total: headers['X-WP-Total'],
				totalPages: headers['X-WP-TotalPages']
			};
			payload.meta = meta;
			payload.id = Number(payload.id);
		}
		return this._super(status, headers, payload, requestData);
	},

	cleanParams(object){
		for (var i in object) {
		  if (object[i] === null || object[i] === undefined) {
		    delete object[i];
		  }
		}
	},

	urlForCreateRecord(modelName, snapshot){
		let url = this._super(...arguments);
		let data = this.serialize(snapshot, {includeId: true});

		this.cleanParams(data);

		return `${url}?${$.param(data)}`;
	}
});
