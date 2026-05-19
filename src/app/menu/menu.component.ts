import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';

import { ClienteService } from '../clientes/servicos/cliente.service';
import { MensagemService } from '../compartilhado/mensagem.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule, RouterLink],
})
export class MenuComponent implements OnInit {
  permissaoUsuario: string | null = null;

  private readonly CHAVE_ULTIMO_BACKUP = 'ultimo-backup-clientes';

  constructor(
    private mensagemService: MensagemService,
    private router: Router,
    private clienteService: ClienteService,
  ) {}

  ngOnInit(): void {
    this.permissaoUsuario = sessionStorage.getItem('permission');

    if (this.permissaoUsuario !== 'OFFLINE') {
      this.validarUltimoBackup();
    }
  }

  mostrarMensagem(): void {
    this.mensagemService.showErrorMessage('Funcionalidade em desenvolvimento!');
  }

  consultarClientesOffline(): void {
    window.location.href = '/consultar-clientes';
  }

  emitirPedidoOffline(): void {
    window.location.href = '/cadastrar-pedido';
  }

  sairModoOffline(): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('permission');
    sessionStorage.removeItem('offline-mode');

    this.mensagemService.showSuccessMessage('Modo offline encerrado.');

    this.router.navigate(['/home']);
  }

  exportarBackupClientes(): void {
    this.clienteService.listarTodosParaBackup().subscribe(
      (clientes) => {
        if (!clientes.length) {
          this.mensagemService.showErrorMessage(
            'Nenhum cliente disponível para exportação.',
          );
          return;
        }

        const clientesOrdenados = [...clientes].sort(
          (a, b) => Number(b.idCliente) - Number(a.idCliente),
        );

        const clientesData = clientesOrdenados.map((cliente) => ({
          idCliente: cliente.idCliente,
          nome: cliente.nome,
          cpfCnpj: cliente.cpfCnpj,
          razaoSocial: cliente.razaoSocial,
          telefone: cliente.telefone,
          celular: cliente.celular,
          email: cliente.email,
          contatosAdicionais: cliente.contatosAdicionais,
          cep: cliente.cep,
          logradouro: cliente.logradouro,
          numero: cliente.numero,
          complemento: cliente.complemento,
          bairro: cliente.bairro,
          cidade: cliente.cidade,
          estado: cliente.estado,
          tipoPgto: cliente.tipoPgto,
          infoPagamento: cliente.infoPagamento,
          cepEntrega: cliente.cepEntrega,
          logradouroEntrega: cliente.logradouroEntrega,
          numeroEntrega: cliente.numeroEntrega,
          complementoEntrega: cliente.complementoEntrega,
          bairroEntrega: cliente.bairroEntrega,
          cidadeEntrega: cliente.cidadeEntrega,
          estadoEntrega: cliente.estadoEntrega,
          sfobras: cliente.sfobras,
          cno: cliente.cno,
          ie: cliente.ie,
          mangueira: cliente.mangueira,
          valorAjudante: cliente.valorAjudante,
          valorAdicional: cliente.valorAdicional,
          precoCx5: cliente.precoCx5,
          precoCx10: cliente.precoCx10,
          precoCx15: cliente.precoCx15,
          precoLv5: cliente.precoLv5,
          precoLv10: cliente.precoLv10,
          precoLv15: cliente.precoLv15,
          observacao: cliente.observacao,
          dataAtualizacaoCliente: this.formatarDataHora(
            cliente.dataAtualizacaoCliente,
          ),
        }));

        const worksheet: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(clientesData);

        const headers = Object.keys(clientesData[0]);

        worksheet['!cols'] = headers.map((header) => {
          const maxLength = Math.max(
            header.length,
            ...clientesData.map(
              (row) => row[header as keyof typeof row]?.toString().length || 0,
            ),
          );

          return { wch: maxLength + 5 };
        });

        const workbook: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          'Backup Clientes',
        );

        const dataAtual = new Date();
        const nomeArquivo = `Backup_Clientes_${this.formatarDataHoraNomeArquivo(dataAtual)}.xlsx`;

        XLSX.writeFile(workbook, nomeArquivo);

        localStorage.setItem(this.CHAVE_ULTIMO_BACKUP, dataAtual.toISOString());

        this.mensagemService.showSuccessMessage(
          'Backup de clientes exportado com sucesso!',
        );
      },
      (error) => {
        console.error('Erro ao exportar clientes:', error);

        const mensagemErro =
          error.status === 403
            ? 'Usuário sem permissão para exportar backup de clientes.'
            : 'Erro ao exportar backup de clientes.';

        this.mensagemService.showErrorMessage(mensagemErro);
      },
    );
  }

  private validarUltimoBackup(): void {
    const ultimoBackup = localStorage.getItem(this.CHAVE_ULTIMO_BACKUP);

    if (!ultimoBackup) {
      this.mensagemService.showErrorMessage(
        'Backup de clientes ainda não foi realizado.',
      );
      return;
    }

    const dataUltimoBackup = new Date(ultimoBackup);

    if (Number.isNaN(dataUltimoBackup.getTime())) {
      localStorage.removeItem(this.CHAVE_ULTIMO_BACKUP);
      return;
    }

    const dataAtual = new Date();
    const diferencaEmMs = dataAtual.getTime() - dataUltimoBackup.getTime();
    const diferencaEmDias = Math.floor(
      diferencaEmMs / (1000 * 60 * 60 * 24),
    );

    if (diferencaEmDias >= 30) {
      this.mensagemService.showErrorMessage(
        `Último backup de clientes foi realizado há ${diferencaEmDias} dias. Realize um novo backup.`,
      );
    }
  }

  private formatarDataHora(data: string): string {
    if (!data) {
      return '';
    }

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
      return '';
    }

    const ano = dataFormatada.getFullYear();
    const mes = String(dataFormatada.getMonth() + 1).padStart(2, '0');
    const dia = String(dataFormatada.getDate()).padStart(2, '0');
    const hora = String(dataFormatada.getHours()).padStart(2, '0');
    const minuto = String(dataFormatada.getMinutes()).padStart(2, '0');
    const segundo = String(dataFormatada.getSeconds()).padStart(2, '0');

    return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
  }

  private formatarDataHoraNomeArquivo(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    const segundo = String(data.getSeconds()).padStart(2, '0');

    return `${ano}-${mes}-${dia}_${hora}-${minuto}-${segundo}`;
  }
}