import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { CentralAdministrativaRoutingModule } from './central-administrativa-routing.module';
import { CentralAdministrativaComponent } from '@app/projetos/projeto/central-administrativa/central-administrativa.component';
import { GeracaoXmlComponent } from '@app/projetos/projeto/central-administrativa/geracao-xml/geracao-xml.component';
import { LogsDutoComponent } from '@app/projetos/projeto/central-administrativa/logs-duto/logs-duto.component';
import { RepositorioXmlComponent } from '@app/projetos/projeto/central-administrativa/repositorio-xml/repositorio-xml.component';
import { AlterarStatusComponent } from '@app/projetos/projeto/central-administrativa/alterar-status/alterar-status.component';
import { UsuariosComponent } from '@app/projetos/projeto/central-administrativa/usuarios/usuarios.component';

@NgModule({
    declarations: [
        CentralAdministrativaComponent,
        GeracaoXmlComponent,
        LogsDutoComponent,
        RepositorioXmlComponent,
        AlterarStatusComponent,
        UsuariosComponent,
    ],
    imports: [
        SharedModule,
        CentralAdministrativaRoutingModule
    ]
})
export class CentralAdministrativaModule { }