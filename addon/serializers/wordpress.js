import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	isNewSerializerAPI: true,

	// Here we wrap the payload in a named object after the model type
	// because this is what Ember expects { post: { datahere } }
	normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
		let newPayload = {};
		if (payload.data && Ember.typeOf(payload.data) === 'array') { // handle queryRecord properly
			newPayload[primaryModelClass.modelName] = payload.data[0];
			newPayload.meta = payload.meta;

		} else {
			
			newPayload[primaryModelClass.modelName] = Ember.typeOf(payload) === 'array' ? payload : [payload];
		}
		
		return this._super(store, primaryModelClass, newPayload, id, requestType);
	},
	// Then, we can deal with our missing root element when extracting arrays from the JSON.
	normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
		const payloadTemp = {};
		const rootKey = Ember.String.pluralize(primaryModelClass.modelName);

		payloadTemp[rootKey] = payload;
		// meta cannot be part of payload but must be adjacent to it
		payloadTemp.meta = payload.meta;

		return this._super(store, primaryModelClass, payloadTemp, id, requestType);
	},

	keyForAttribute(attr){
		if(attr === 'embedded'){
			return '_embedded';
		}
		
		return Ember.String.underscore(attr);
	},

	keyForRelationship(attr){
		return Ember.String.underscore(attr);
	},

	normalize(modelClass, resourceHash, prop) {
		// As you get bored typing `title.rendered`, here we move the `rendered` part up.

		['content', 'title', 'excerpt'].forEach(property => {
			if(resourceHash[property] && resourceHash[property].rendered){
				resourceHash[property] = resourceHash[property].rendered;
			}
		});

		return this._super(modelClass, resourceHash, prop);
	}
});
