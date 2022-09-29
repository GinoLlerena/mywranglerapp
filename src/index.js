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
//import {bundleMDX} from "mdx-bundler";

const router = new Router();

const allowedOrigins = [
	"http://localhost:8080",
	"https://mywranglerapp.gino-llerena.workers.dev"
]

const corsHeaders = (origin) => ({
	"Access-Control-Allow-Headers": "*",
	"Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS, PUT",
	"Access-Control-Allow-Origin": origin
})

const checkOrigin = request => {
	const origin = request.headers.get("Origin")
	const foundOrigin = allowedOrigins.find(allowedOrigin => allowedOrigin.includes(origin))
	return foundOrigin ? foundOrigin : "*"
}

router.add('GET', '/elements', async (request, response) => {
  
	try {

		const elements = await getElements()
		const allowedOrigin = checkOrigin(request)

		return new Response(JSON.stringify(elements.data), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders(allowedOrigin)
			},
		});
	}
	catch(error){
		const faunaError = getFaunaError(error);
	  	response.send(faunaError.status, faunaError);
	}
});

router.add('POST', '/elements', async (request, response) => {
	try {

		const data =  await request.body()
		const { element } = JSON.parse(data)
	    const result = await addElement(element)

		const allowedOrigin = checkOrigin(request)
		return new Response(JSON.stringify(result), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders(allowedOrigin)
			},
		});

	} catch (error) {
		  const faunaError = getFaunaError(error);
		  response.send(faunaError.status, faunaError);
	}
  });

  router.add('GET', '/elements/:elementId', async (request, response) => {
	try {
	  const elementId = request.params.elementId;
	  const element = await getElement(elementId)
		/*const result = await bundleMDX({
			source: element.context
		})*/
		const allowedOrigin = checkOrigin(request)
		return new Response(JSON.stringify(element), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders(allowedOrigin)
			},
		});
  
	} catch (error) {
	  const faunaError = getFaunaError(error);
	  response.send(faunaError.status, faunaError);
	}
  });

	router.add('OPTIONS', '/elements/:elementId', async (request, response) => {

		try {
			const allowedOrigin = checkOrigin(request)
			return new Response("OK", { headers : corsHeaders(allowedOrigin)})
		} catch (error) {
			const faunaError = getFaunaError(error);
			response.send(faunaError.status, faunaError);
		}
	});
  
	router.add('DELETE', '/elements/:elementId', async (request, response) => {

		try {
			  const elementId = request.params.elementId;
			  const result = await deleteElement(elementId)

			  const allowedOrigin = checkOrigin(request)
			  return new Response(JSON.stringify(result), {
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders(allowedOrigin)
				},
			  });

		} catch (error) {
		  const faunaError = getFaunaError(error);
		  response.send(faunaError.status, faunaError);
		}
	});

  router.add('PUT', '/elements/:elementId', async (request, response) => {

	try {
	  const data = await request.body();
	  const { element } = JSON.parse(data)
	  const result = await updateElement(element)

		const allowedOrigin = checkOrigin(request)
		return new Response(JSON.stringify(result), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders(allowedOrigin)
			},
		});
  
	} catch (error) {
	  const faunaError = getFaunaError(error);
	  response.send(faunaError.status, faunaError);
	}
  });

listen(router.run);