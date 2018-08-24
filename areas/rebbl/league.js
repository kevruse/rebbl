'use strict';
const db = require('../../lib/LeagueService.js')
  , configuration = require('../../lib/ConfigurationService.js')
  , util = require('../../lib/util.js')
  , express = require('express')
  , router = express.Router({mergeParams: true});

router.get('/', util.checkCache, async function(req, res){
  let data = {standings:null, rounds:null, league:req.params.league };

  let league = req.params.league;
  if (league.toLowerCase() !== "rebbll" && league.toLowerCase() !== "xscessively elfly league" ){
    league = new RegExp(`^REBBL[\\s-]+${league}`, 'i');
  } else {
    league = new RegExp(`^${league}`, 'i');
  }
  if( req.params.league.toLowerCase() === "rampup"){
    league = new RegExp(`${req.params.league}$`, 'i');
  }
  data.standings = await db.getCoachScore(league, null, true);
  data.rounds = await db.getDivisions(league);

  data.cutoffs = configuration.getPlayoffTickets(req.params.league);
  res.render('rebbl/league/index', data);
});

module.exports = router;