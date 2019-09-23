const dynamoApi = require("../../common/dynamoCalls");
const HttpCodes = require("http-status-codes");
const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
};

const response = (res, status = HttpCodes.OK, data = {}) => {
  res.headers = HEADERS;
  res.status(status).send(data);
};

function index(req, res) {
  return dynamoApi
    .listNotes()
    .then(notes => response(res, undefined, notes))
    .catch(e => {
      console.error(e);
      return response(res, HttpCodes.INTERNAL_SERVER_ERROR, e);
    });
}

function get(req, res) {
  const noteId = req.params.id;
  return dynamoApi
    .getNote(noteId)
    .then(note => {
      if (!note) {
        response(res, HttpCodes.NOT_FOUND, {});
      }
      return response(res, undefined, note);
    })
    .catch(e => {
      console.error(e);
      return response(res, HttpCodes.INTERNAL_SERVER_ERROR);
    });
}

function create(req, res) {
  const { content, attachment } = req.body;
  return dynamoApi
    .createNote(content, attachment)
    .then(note => response(res, HttpCodes.CREATED, note))
    .catch(e => {
      console.error(e);
      return response(res, HttpCodes.INTERNAL_SERVER_ERROR);
    });
}

function update(req, res) {
  const noteId = req.params.id;
  const { content, attachment } = req.body;
  return dynamoApi
    .updateNote(noteId, content, attachment)
    .then(note => response(res, undefined, note))
    .catch(e => {
      console.error(e);
      return response(res, HttpCodes.INTERNAL_SERVER_ERROR);
    });
}

function remove(req, res) {
  const noteId = req.params.id;
  return dynamoApi
    .removeNote(noteId)
    .then(() => response(res))
    .catch(e => {
      console.error(e);
      return response(res, HttpCodes.INTERNAL_SERVER_ERROR);
    });
}

module.exports = {
  index,
  get,
  create,
  update,
  remove
};
