import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { zip } from 'rxjs';

import { RecursoHumanoFormComponent } from '@app/projetos/recurso-humano-form/recurso-humano-form.component';
import { AppService } from '@app/app.service';
import { Projeto, ExtratosEmpresas, Etapa, TextValue, CategoriaContabil, ExtratoItem } from '@app/models';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { RecursoMaterialFormComponent } from '@app/projetos/recurso-material-form/recurso-material-form.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlocarRecursoHumanoFormComponent } from '@app/projetos/alocar-recurso-humano-form/alocar-recurso-humano-form.component';
import { AlocarRecursoMaterialFormComponent } from '@app/projetos/alocar-recurso-material-form/alocar-recurso-material-form.component';

@Component({
    selector: 'app-extrato-financeiro-empresas',
    templateUrl: './extrato-financeiro-empresas.component.html',
    styles: []
})
export class ExtratoFinanceiroEmpresasComponent implements OnInit {

    projeto: Projeto;
    extrato: ExtratosEmpresas;
    etapas: { [propName: number]: Etapa } = {};

    alocacoesRH: Array<any> = [];
    alocacoesRM: Array<any> = [];

    categoriasContabeis: { [propName: string]: TextValue } = {
        "RH": { text: "Recursos Humanos", value: "RH" }
    };

    @ViewChild(LoadingComponent) loading: LoadingComponent;

    get extratoEmpresas() {
        return this.extrato ? this.extrato.empresas.filter(e => e.total > 0) : [];
    }
    get totalGeral() {
        return this.extrato ? this.extrato.valor : 0;
    }

    constructor(protected app: AppService, private route: ActivatedRoute) {
        CategoriaContabil.forEach(c => {
            this.categoriasContabeis[c.value] = c;
        });
    }

    categoriaPorCod(cod) {
        if (this.categoriasContabeis[cod]) {
            return this.categoriasContabeis[cod].text;
        }
        return '';
    }



    ngOnInit() {
        const projeto$ = this.route.parent.data.pipe(map(d => d.projeto));
        zip(projeto$).subscribe(([projeto]) => {
            this.projeto = projeto;
            this.load();
        });
    }

    load() {
        this.loading.show();
        const extratos$ = this.app.projetos.getExtratoEmpresas(this.projeto.id);
        const etapas$ = this.app.projetos.getEtapas(this.projeto.id);
        zip(extratos$, etapas$, this.app.projetos.getAlocacaoRH(this.projeto.id), this.app.projetos.getAlocacaoRM(this.projeto.id))
            .subscribe(([extrato, etapas, alocacoesRH, alocacoesRM]) => {
                this.extrato = extrato;
                this.alocacoesRH = alocacoesRH;
                this.alocacoesRM = alocacoesRM;

                etapas.forEach((etapa, index) => {
                    this.etapas[etapa.id] = Object.assign(etapa, { numeroEtapa: index + 1 });
                });

                this.loading.hide();
            });
    }

    openModal(item: ExtratoItem) {
        let modal: NgbModalRef;

        if (item.recursoHumano) {
            const alocacao = this.alocacoesRH.find(a => a.id === item.alocacaoId);
            modal = this.app.modal.open(AlocarRecursoHumanoFormComponent, { size: 'lg' });
            modal.componentInstance.alocacao = alocacao;

        } else if (item.recursoMaterial) {
            const alocacao = this.alocacoesRM.find(a => a.id === item.alocacaoId);
            modal = this.app.modal.open(AlocarRecursoMaterialFormComponent, { size: 'lg' });
            modal.componentInstance.alocacao = alocacao;
        }

        if (modal) {
            modal.componentInstance.projeto = this.projeto;
            modal.result.then(result => {
                console.log(result);
            }, error => {

            });
        }
    }

}
