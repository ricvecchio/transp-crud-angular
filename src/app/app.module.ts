import { AsyncPipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CabecalhoComponent } from './cabecalho/cabecalho.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login/login.component';
import { MensagemComponent } from './home/mensagem/mensagem.component';
import { NovoUsuarioComponent } from './home/novo-usuario/novo-usuario.component';
import { MenuComponent } from './menu/menu.component';
import { RodapeComponent } from './rodape/rodape.component';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [AppRoutingModule,
        BrowserModule,
        MatToolbarModule,
        FormsModule,
        ReactiveFormsModule,
        AsyncPipe,
        CabecalhoComponent,
        RodapeComponent,
        HomeComponent,
        LoginComponent,
        NovoUsuarioComponent,
        MenuComponent,
        MensagemComponent], providers: [
        provideAnimations(),
        provideHttpClient(),
        importProvidersFrom(MatNativeDateModule),
        provideMomentDateAdapter(),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
