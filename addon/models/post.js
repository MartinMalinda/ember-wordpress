import DS from 'ember-data';

const {Model, attr, hasMany, belongsTo} = DS;

export default Model.extend({
	title: attr('string'),
	content: attr('string'),
	excerpt: attr('string'),
	slug: attr('string'),
	date: attr('date'),
	featured_media: attr('number'),
	format: attr(),
	categories: hasMany('category', {async: true}),
	tags: hasMany('tag', {async: true}),
	author: belongsTo('user'),
	acf: attr()
});
