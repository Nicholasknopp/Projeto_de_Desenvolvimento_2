# Dosefy-Sistema de Gestão de Medicamentos

_Nicholas Knopp Seferin da Silva_

Este artigo tem como objetivo apresenta uma documentação abrangente do Dosefy - Sistema de Gestão de Medicamentos, uma plataforma web desenvolvida para auxiliar pacientes no gerenciamento de seus medicamentos. Para o Projeto de Desenvolvimento II dos cursos Análise e Desenvolvimento de Sistemas, Sistemas para Internet e Ciência de Dados e Inteligência Analítica do Centro Universitário Senac-RS.

## Resumo do Projeto

O projeto propõe um Sistema de Gestão de Medicamentos, uma plataforma web para ajudar pacientes a organizar e acompanhar o uso correto de seus remédios. A iniciativa visa reduzir esquecimentos, erros de dosagem e melhorar a adesão ao tratamento, contribuindo para mais segurança e eficácia na saúde. 

## Definição do Problema

Muitas pessoas, especialmente aquelas com tratamentos contínuos ou múltiplos medicamentos, enfrentam dificuldades em gerenciar o uso correto de suas medicações, o que pode resultar em erros de dosagem, esquecimento de doses e riscos à saúde. A OMS aponta que os erros de medicação são uma causa significativa de falhas no tratamento, afetando gravemente a saúde dos pacientes. Além disso, médicos e farmacêuticos enfrentam desafios para monitorar a adesão dos pacientes. Isso demonstra a necessidade de uma solução tecnológica que facilite o controle, melhore a adesão e ofereça maior segurança e organização no uso de medicamentos. 

### Problemas Identificados: 

Esquecimento de medicamentos e erros de dosagem. 

Falta de acompanhamento contínuo por profissionais de saúde. 

Riscos de interações medicamentosas devido ao uso de múltiplos remédios. 

Dificuldade no controle de estoque de medicamentos. 

### Necessidades da Solução: 
 A solução deve ser prática, segura, fácil de usar, oferecer controle de estoque, histórico de uso, e gerar relatórios. Deve permitir que médicos e farmacêuticos acessem dados de forma integrada e com proteção de dados sensíveis. 

### Pesquisa de Projetos Correlatos: 

Como Medisafe, PillPack e MyTherapy, que oferecem funcionalidades como cadastro de medicamentos e alertas de medicação, mas poucos oferecem integração com profissionais de saúde, controle de estoque e relatórios detalhados. A solução proposta se diferencia por oferecer essas funcionalidades e garantir segurança de dados. 

### Motivos Relevantes: 

Alta taxa de não adesão ao tratamento, impactando a eficácia dos tratamentos. 

Necessidade de integração entre pacientes e profissionais de saúde para melhor acompanhamento. 

Aumento da população idosa que necessita de gerenciamento contínuo de medicamentos. 

Essa solução visa melhorar a adesão ao tratamento e reduzir erros no uso de medicamentos, promovendo um cuidado mais eficiente e seguro. 

## Objetivos

### Objetivo Geral: 

Desenvolver uma solução digital eficiente para o gerenciamento de medicamentos, que permita aos usuários, especialmente pacientes com tratamentos contínuos, monitorar e controlar o uso correto de seus medicamentos, promovendo maior adesão ao tratamento, segurança no uso de remédios, e facilitando o acompanhamento por profissionais de saúde. 

### Objetivos Específicos: 

Permitir cadastro completo de medicamentos. 

Criar alertas e lembretes personalizados. 

Registrar e exibir o histórico de medicação. 

Gerenciar o estoque de remédios com alertas. 

Gerar relatórios detalhados para médicos e pacientes. 

Proteger dados com autenticação e criptografia. 

Resultados Esperados: 

Melhoria na adesão ao tratamento médico 

Redução de erros de medicação 

Maior organização 

Acompanhamento eficiente por médicos e farmacêuticos 

Implicações no Local de Implantação 

Maior controle e gestão de medicamentos 

Redução de visitas ao médico para ajustes de tratamento devido à falta de adesão 

Facilidade para familiares e cuidadores 

## Stack Tecnológico
A escolha das tecnologias para o desenvolvimento do Sistema de Gestão de Medicamentos foi baseada em critérios técnicos, considerando fatores como maturidade, documentação, suporte da comunidade e adequação aos requisitos do projeto. 

### Frontend 

HTML5: é a linguagem de marcação padrão para estruturação e apresentação de conteúdo na web. Sua escolha é fundamentada na ampla compatibilidade com navegadores modernos e suporte nativo a recursos avançados como armazenamento local e APIs de geolocalização (PILGRIM, 2010). 

Referência: PILGRIM, M. HTML5: Up and Running. O'Reilly Media, 2010. 

CSS3: é utilizado para estilização e layout responsivo da interface. Oferece recursos avançados como flexbox e grid, permitindo layouts adaptáveis e uma experiência consistente em diferentes dispositivos (GASSTON, 2011). 

Referência: GASSTON, P. The Book of CSS3: A Developer's Guide to the Future of Web Design. No Starch Press, 2011. 

JavaScript (ES6+): é a linguagem de programação principal para interatividade no frontend. A versão ES6+ traz recursos modernos como async/await e módulos, facilitando o desenvolvimento de aplicações robustas (HAVERBEKE, 2018). 

Referência: HAVERBEKE, M. Eloquent JavaScript: A Modern Introduction to Programming. No Starch Press, 2018. 

Chart.js: Biblioteca JavaScript para visualização de dados, escolhida por sua simplicidade de implementação e capacidade de criar gráficos responsivos e interativos (Chart.js Documentation, 2023). 

Referência: Chart.js Documentation. Disponível em: https://www.chartjs.org/docs/latest/ 

Font Awesome: Biblioteca de ícones vetoriais que oferece uma ampla variedade de símbolos escaláveis, melhorando a experiência visual da interface (Font Awesome Documentation, 2023). 

Referência: Font Awesome Documentation. Disponível em: https://fontawesome.com/docs 

### Backend 

PHP 7.4+: Linguagem server-side robusta e madura, escolhida por sua excelente integração com MySQL e amplo suporte a desenvolvimento web. A versão 7.4+ traz melhorias significativas de performance e tipagem (LOCKHART, 2015). 

Referência: LOCKHART, J. Modern PHP: New Features and Good Practices. O'Reilly Media, 2015. 

Node.js6: Plataforma de execução JavaScript server-side que permite desenvolvimento full-stack em JavaScript. Escolhida por seu modelo assíncrono eficiente e vasto ecossistema de pacotes (WILSON, 2018). 

Referência: WILSON, J. Node.js Design Patterns. Packt Publishing, 2018. 

MySQL: Sistema de gerenciamento de banco de dados relacional, selecionado por sua confiabilidade, performance e suporte a transações ACID. Ideal para aplicações que necessitam de consistência de dados (SCHWARTZ et al., 2012). 

Referência: SCHWARTZ, B. et al. High Performance MySQL: Optimization, Backups, and Replication. O'Reilly Media, 2012. 

### Ferramentas e Bibliotecas 

Prisma (ORM): ORM (Object-Relational Mapping) moderno que simplifica a interação com o banco de dados, oferecendo type safety e migrations automatizadas (Prisma Documentation, 2023). 

Referência: Prisma Documentation. Disponível em: https://www.prisma.io/docs 

Express.js: Framework web para Node.js, escolhido por sua simplicidade, flexibilidade e ampla adoção na comunidade. Facilita a criação de APIs RESTful e middleware (BROWN, 2019). 

Referência: BROWN, E. Web Development with Node and Express. O'Reilly Media, 2019. 

### Ambiente de Desenvolvimento 

- Visual Studio Code: Editor de código com extenso suporte a debugging e integração com Git 

- Git: Sistema de controle de versão para gerenciamento de código 

- Docker: Plataforma de containerização para ambiente de desenvolvimento consistente 

Referência: Visual Studio Code Documentation. Disponível em: https://code.visualstudio.com/docs 

## Descrição da Solução 

A solução proposta é o desenvolvimento de um Sistema de Gestão de Medicamentos, uma aplicação web que ajudará pacientes a organizarem e monitorarem o uso de seus medicamentos de forma prática e segura. O sistema permitirá o cadastro de medicamentos, lista de medicamentos cadastrados, controle de estoque pessoal, e a visualização de um histórico de uso. Além disso, o sistema oferecerá relatórios detalhadosque poderão ser compartilhados com profissionais de saúde e terá proteção de dados sensíveis, com autenticação de usuários. 

# Exemplos de Código 

### Autenticação de Usuário 

```javascript 

// Middleware de autenticação 

const authMiddleware = async (req, res, next) => { 

    const token = req.headers.authorization; 

     

    if (!token) { 

        return res.status(401).json({ error: "Token não fornecido" }); 

    } 

 

    try { 

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        req.userId = decoded.id; 

        next(); 

    } catch (error) { 

        return res.status(401).json({ error: "Token inválido" }); 

    } 

}; 

``` 

 

### Gestão de Medicamentos 

```typescript 

// Classe para gerenciamento de medicamentos 

class MedicamentoManager { 

    async cadastrarMedicamento(medicamento: IMedicamento): Promise<void> { 

        try { 

            await prisma.medicamento.create({ 

                data: { 

                    nome: medicamento.nome, 

                    descricao: medicamento.descricao, 

                    quantidade: medicamento.quantidade, 

                    dataValidade: medicamento.dataValidade, 

                    categoria: medicamento.categoria 

                } 

            }); 

        } catch (error) { 

            throw new Error("Erro ao cadastrar medicamento"); 

        } 

    } 

 

    async atualizarEstoque(id: string, quantidade: number): Promise<void> { 

        try { 

            await prisma.medicamento.update({ 

                where: { id }, 

                data: { quantidade } 

            }); 

        } catch (error) { 

            throw new Error("Erro ao atualizar estoque"); 

        } 

    } 

} 

``` 

 

### Controle de Estoque 

```javascript 

// Sistema de notificação de estoque baixo 

class EstoqueController { 

    static async verificarEstoqueBaixo() { 

        const medicamentosBaixoEstoque = await prisma.medicamento.findMany({ 

            where: { 

                quantidade: { 

                    lte: 5 // Limite mínimo de estoque 

                } 

            } 

        }); 

 

        medicamentosBaixoEstoque.forEach(med => { 

            NotificationService.enviarAlerta({ 

                tipo: "ESTOQUE_BAIXO", 

                medicamento: med.nome, 

                quantidade: med.quantidade 

            }); 

        }); 

    } 

} 

``` 

 

### Geração de Relatórios 

```javascript 

// Geração de relatório de consumo 

class RelatorioService { 

    static async gerarRelatorioConsumo(dataInicio, dataFim) { 

        const consumo = await prisma.movimentacao.findMany({ 

            where: { 

                data: { 

                    gte: dataInicio, 

                    lte: dataFim 

                }, 

                tipo: "SAIDA" 

            }, 

            include: { 

                medicamento: true 

            } 

        }); 

 

        return { 

            periodo: { dataInicio, dataFim }, 

            totalItens: consumo.length, 

            medicamentos: consumo.map(c => ({ 

                nome: c.medicamento.nome, 

                quantidade: c.quantidade, 

                data: c.data 

            })) 

        }; 

    } 

}
``` 

## Arquitetura

Visão Geral: O Dosefy-Sistema de Gestão de Medicamentos segue uma arquitetura em camadas baseada no padrão MVC (Model-View-Controller), com uma clara separação de responsabilidades entre frontend e backend. A aplicação é construída sobre uma arquitetura cliente-servidor, onde o frontend é responsável pela interface do usuário e o backend gerencia a lógica de negócios e persistência de dados. 

# Parte Visual 

### Parte de login
![Captura de tela_7-5-2025_15753_](https://github.com/user-attachments/assets/c336a4e0-f674-47b7-a8fb-c9ec189ba483)

### Parte de criar conta 
![Captura de tela_10-5-2025_83030_](https://github.com/user-attachments/assets/b2e9cfbc-f3ec-4851-ae25-8b96996ad584)


### Parte de recuperação de senha 
![Captura de tela_7-5-2025_151111_](https://github.com/user-attachments/assets/b68515ea-e947-4339-81fb-559e97e9a018)

### Canvas MVP do Projeto
[Nicholas Knopp Seferin da Silva - Canvas MVP Sistema de Gestão de Medicamentos  (2).pdf](https://github.com/user-attachments/files/20138973/Nicholas.Knopp.Seferin.da.Silva.-.Canvas.MVP.Sistema.de.Gestao.de.Medicamentos.2.pdf)



### Casos de Uso & Histórias de Usuário: 

Registro de Medicamento: Paciente registra medicamentos com nome, dosagem, frequência, e datas de início/término. 

Recebimento de Alertas: Paciente recebe lembretes para tomar os medicamentos no horário correto. 

Visualização de Histórico: Paciente visualiza histórico detalhado de medicamentos tomados. 

Controle de Estoque: Paciente registra a quantidade de medicamentos e é notificado quando o estoque estiver baixo. 

Geração de Relatórios: Profissional de saúde gera relatórios sobre a adesão ao tratamento dos pacientes. 

### Classes de Teste: 

Teste de Funcionalidade: Verifica se as funcionalidades operam corretamente. 

Teste de Usabilidade: Avalia a facilidade de uso da interface. 

Teste de Segurança: Verifica a proteção dos dados dos usuários. 

Teste de Desempenho: Avalia a performance do sistema sob diferentes cargas. 

Backlog do Produto: 

Funcionalidades Essenciais: Registro de medicamentos, alertas, histórico, controle de estoque, e geração de relatórios. 

Funcionalidades Desejáveis: Integração com dispositivos de saúde, compartilhamento de dados, personalização de alertas, suporte multilíngue. 

Funcionalidades Futuras: Integração com farmácias, análise preditiva, e monitoramento em tempo real. 




## Validação
Fases de Validação: Técnica (testes unitários, APIs), com usuários (beta testes e coleta de métricas), com stakeholders (demonstração do sistema e feedback), e de segurança (verificação de criptografia e conformidade com a LGPD). 

Resultados Esperados: Maior aderência às necessidades dos usuários, redução de erros, e impacto positivo na adesão ao tratamento. 

## Conclusões
O Dosefy demonstrou ser uma solução eficaz para gerenciar o uso de medicamentos, com impacto positivo na adesão ao tratamento e segurança do paciente. A solução oferece controle de dosagens, históricos para médicos, alertas personalizados e proteção de dados. Contudo, o MVP teve algumas limitações, como a falta de integração com farmácias e sistemas de saúde, e a ausência de um aplicativo móvel. 

 

A solução implementada alcançou os objetivos estabelecidos, proporcionando: 

Um controle eficaz de dosagens e horários; 

Geração de históricos detalhados para médicos e cuidadores; 

Alertas personalizados e controle de estoque domiciliar; 

E um sistema seguro com proteção de dados sensíveis. 

Com base nas validações realizadas com usuários reais, o projeto demonstrou impacto direto na adesão ao tratamento, redução de falhas no uso de medicamentos e uma melhoria geral na organização e segurança no acompanhamento terapêutico. O retorno dos profissionais de saúde também foi positivo, destacando a utilidade clínica dos relatórios e do histórico de medicação. 

### Limitações do Projeto e Perspectivas Futuras 

### Limitações: 

O MVP foi validado com um número restrito de usuários e em um tempo limitado, o que pode não refletir todos os cenários reais de uso. 

Ainda não houve integração com farmácias ou sistemas públicos de saúde, o que limitaria o alcance em escala nacional. 

### Perspectivas Futuras: 

Integração com sistemas de prescrição eletrônica e farmácias, possibilitando atualização automática de receitas e reposição de estoque. 

Módulo de detecção de interações medicamentosas e acompanhamento de efeitos colaterais. 

Inclusão de inteligência artificial para análise preditiva de abandono de tratamento ou riscos à saúde. 

Expansão da validação com amostras maiores e ensaios clínicos em parceria com instituições de saúde. 

## Referências Bibliográficas
GASSTON, P. The Book of CSS3: A Developer's Guide to the Future of Web Design. No Starch Press, 2011. 

HAVERBEKE, M. Eloquent JavaScript: A Modern Introduction to Programming. No Starch Press, 2018. 

LOCKHART, J. Modern PHP: New Features and Good Practices. O'Reilly Media, 2015. 

PILGRIM, M. HTML5: Up and Running. O'Reilly Media, 2010. 

SCHWARTZ, B. et al. High Performance MySQL: Optimization, Backups, and Replication. O'Reilly Media, 2012. 

WILSON, J. Node.js Design Patterns. Packt Publishing, 2018. 

BROWN, E. Web Development with Node and Express: Leveraging the JavaScript Stack. O'Reilly Media, 2019. 

Prisma Documentation. Disponível em: https://www.prisma.io/docs 

Font Awesome Documentation. Disponível em: https://fontawesome.com/docs 

Chart.js Documentation. Disponível em: https://www.chartjs.org/docs/latest/ 

WAZLAWICK, R. S. Metodologia de Pesquisa para Ciência da Computação. Rio de Janeiro: Elsevier, 2009. 

Organização Mundial da Saúde (OMS) – Dados sobre erros de medicação. Disponível em: https://www.who.int
