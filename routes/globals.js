const express = require('express');
const router = express.Router();
const RoutingService = require('../services/RoutingService')(router, 'globals');
RoutingService.crud([2,0,2,2]);

module.exports = router;