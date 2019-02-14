import { Component, OnInit, Input } from '@angular/core';
import { Routes, ActivatedRoute } from '@angular/router';
import { filter } from 'lodash-es';
import { map } from 'rxjs/operators';
import { zip } from 'rxjs';
import { Projeto } from '@app/models';

@Component({
    selector: 'app-central-administrativa',
    templateUrl: './central-administrativa.component.html',
    styleUrls: ['./central-administrativa.component.scss']
})
export class CentralAdministrativaComponent implements OnInit {

    routes: Routes;
    projeto: Projeto;

    constructor(private route: ActivatedRoute) {

        const projeto$ = this.route.parent.data.pipe(map(d => d.projeto));
        const rotas$ = this.route.data.pipe(map(d => d.routes.filter(r => r.path !== "**" && r.path.length > 0)));

        zip(projeto$, rotas$).subscribe(([projeto, rotas]) => {
            this.routes = rotas;
            this.projeto = projeto;
        });
    }

    ngOnInit() {
    }

}
