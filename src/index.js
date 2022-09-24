/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


import {Router, listen} from 'worktop';
import {getFaunaError} from './utils.js';
import { addElement, deleteElement, getElement, getElements, updateElement } from './api/element/element.js';

const router = new Router();

router.add('GET', '/', async (request, response) => {
  
	try {
		const elements = await getElements()
		//response.status(200).json(elements.data);
		response.send(200, elements.data);
	}
	catch(error){
		const faunaError = getFaunaError(error);
	  	response.send(faunaError.status, faunaError);
	}
});

router.add('POST', '/elements', async (request, response) => {
	try {
	  const { element } = await request.body();
  
	  const result = await addElement(element)
  
	  response.send(200, {
		elementId: result.ref.id
	  });
	} catch (error) {
	  const faunaError = getFaunaError(error);
	  response.send(faunaError.status, faunaError);
	}
  });

  router.add('GET', '/elements/:elementId', async (request, response) => {
	try {
	  const elementId = request.params.elementId;
  
	  const result = await getElement(elementId)
  
	  response.send(200, result);
  
	} catch (error) {
	  const faunaError = getFaunaError(error);
	  response.send(faunaError.status, faunaError);
	}
  });
  
  router.add('DELETE', '/elements/:elementId', async (request, response) => {

	try {
	  const elementId = request.params.elementId;
  
	  const result = await deleteElement(elementId)
  
	  response.send(200, result);
  
	} catch (error) {
	  const faunaError = getFaunaError(error);
	  response.send(faunaError.status, faunaError);
	}
  });

  router.add('PATCH', '/elements/:elementId', async (request, response) => {

	try {
	  const elementId = request.params.elementId;
	  const { element } = await request.body();
  
	  const result = await updateElement(element)
  
	  response.send(200, result);
  
	} catch (error) {
	  const faunaError = getFaunaError(error);
	  response.send(faunaError.status, faunaError);
	}
  });

listen(router.run);