"use strict";
var router_1 = require('@angular/router');
var home_component_1 = require('./home.component');
var dashboard_component_1 = require('./dashboard.component');
var teamselection_component_1 = require('./teamselection.component');
var rules_component_1 = require('./rules.component');
var scoring_component_1 = require('./scoring.component');
var performance_component_1 = require('./performance.component');
var appRoutes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'dashboard', component: dashboard_component_1.DashboardComponent },
    { path: 'teamselection', component: teamselection_component_1.TeamSelectionComponent },
    { path: 'rules', component: rules_component_1.RulesComponent },
    { path: 'scoring', component: scoring_component_1.ScoringComponent },
    { path: 'viewperformances', component: performance_component_1.PerformanceComponent }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes, { useHash: true });
//# sourceMappingURL=app.routing.js.map