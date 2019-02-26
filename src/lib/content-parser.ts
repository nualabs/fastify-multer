import { IncomingMessage } from 'http'
import fp, { PluginOptions, nextCallback } from 'fastify-plugin'
import { FastifyInstance } from 'fastify'

const kMultipart = Symbol('multipart')

function setMultipart(req: IncomingMessage, done: (err: Error | null) => void) {
  // nothing to do, it will be done by multer in beforeHandler method
  ;(req as any)[kMultipart] = true
  done(null)
}

export function isMultipart(): boolean {
  return this.req[kMultipart] || false
}

function fastifyMulter(fastify: FastifyInstance, options: PluginOptions, next: nextCallback) {
  fastify.addContentTypeParser('multipart', setMultipart)
  fastify.decorateRequest('isMultipart', isMultipart)

  next()
}

export default fp(fastifyMulter, {
  fastify: '>= 2.0.0',
  name: 'fastify-multer',
})