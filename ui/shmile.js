import AppState from './appState'
import _ from 'underscore'
import Backbone from 'backbone'
import PhotoView from './photoView'
import ButtonView from './buttonView'
import ShmileStateMachine from './shmileStateMachine'
import StateMachineEventHandler from './stateMachineEventHandler'
import SocketProxy from './socketProxy'
import SocketLayer from './socketLayer'
import config from './config'

require("../css/shmile.css")

var Shmile = function() {};
Shmile.prototype.initialize = function() {
  var socketProxy = new SocketProxy();
  var appState = new AppState();

	// Inter-object communication layer.
	var channel = {};
	_.extend(channel, Backbone.Events);

  window.io = window.io || undefined;

  var p = new PhotoView(config, appState, channel);
  var bv = new ButtonView(channel);
  var ssm = new ShmileStateMachine(p, socketProxy, appState, config, bv)

	var eventHandler = new StateMachineEventHandler(ssm, channel).init();

  bv.fsm = ssm.fsm

  var layer = new SocketLayer(window.io, socketProxy)
  layer.init();
  layer.register(ssm.fsm);

  window.socketProxy = socketProxy

  bv.render();
  p.render();
};

module.exports = Shmile;
window.Shmile = Shmile;
