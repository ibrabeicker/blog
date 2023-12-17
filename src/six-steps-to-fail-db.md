# 6 Passos Para Fracassar Com Banco de Dados

Grande parte dos sistemas que geram algum valor precisam trabalhar com dados persistentes, e por isso acho que toda boa aplicação é pelo menos 50% boa pela forma como ela lida com seus dados.

Tratar dados de aplicações é uma daquelas coisas super diversificadas entre as esferas de de desenvolvimento de software, e no meio desse ambiente nada padronizado está o desenvolvedor e o papel que ele realiza nesses cenários. Alguns não lidam com o banco, toda a elaboração de tabelas e queries é atribuída a DBAs ou administradores de banco de dados, um processo rígido ao extremo e já ultrapassado. Outros estão trabalhando exclusivamente em sistemas que já nasceram usando tecnologias NoSQL e nunca tiveram interesse ou oportunidade de se aprofundarem em bancos relacionais e SQL tradicional. O cenário mais preocupante e mais oportuno para surgirem desastres é aquele em que é papel do dev lidar com o banco e seus dados, mas por deficiências na formação desse profissional, desinteresse próprio ou uma noção equivocada que as coisas sempre são melhor resolvidas na linguagem de programação, seus conhecimentos do funcionamento de bancos de dados relacionais e a forma de operá-los são muito rasos.

Por isso listo aqui seis maneiras fáceis de fracassar, como desenvolvedor, ao lidar com BDs.

## Não saber SQL

SQL ainda é bastante usado (está em número 4 nas linguagens mais usadas pela pesquisa do StackOverflow) e está presente nos sistemas há mais de 40 anos. Tem grandes chances de ser bem mais velho que a linguagem de programação que você usa hoje e apesar de tanta idade vem sendo constantemente evoluído: já trata de aspectos mais modernos como armazenamento de chave-valor e tipos de dados Json. Nenhuma tecnologia se mantém relevante por tanto tempo sem que ela seja de grande valor, poderosa e flexível por isso julgo que é de muita importância todo desenvolvedor ter familiaridade com o SQL.

Uma das maiores vantagens de escrever SQL é sua natureza declarativa, isso significa que você diz o **QUE** você quer que seja executado e não encadear uma série de comandos para que juntos eles formem um **COMO**. Isso é valioso à medida que seu banco vai pegar sua instrução e com uma série de conhecimentos que ele mantém sobre seus dados, executá-lo da forma mais eficiente e correta que ele conseguir. Caso isso precisasse ser feito pelo programador, resultaria numa quantidade enorme de implementações que no fim não teriam garantia nenhuma que estariam corretas ou performáticas.

Por isso não saber SQL é um passo fácil para o fracasso, os problemas que ele resolveria agora são seus pra lidar, implementar, executar e testar.

## Usar apenas ORM

As bibliotecas de ORM são uma ferramenta poderosa ao nosso dispor, que permitem fazer um mapeamento entre entidades do seu sistema encarnadas na linguagem de programação e tabelas de banco de dados. Mas assim como toda tecnologia, ela tem seus benefícios e suas fraquezas. Você já deve ter lido em algum lugar algo como:

> Mapeamento Objeto-Relacional (ORM) permite que você abstraia a complexidade de acessar um banco de dados

Essa frase tem duas mentiras, uma mais explícita e uma implícita. A explícita é que seu framework de ORM é capaz de abstrair completamente os detalhes de usar a tecnologia do banco de dados que está por baixo, e a segunda é que esconder tais detalhes é desejável.

Os bancos de dados mais usados hoje (PostgreSQL, Oracle, MySql, SqlServer, etc) tem diferenças importantes entre si, não estar ciente e até se aproveitar de tais diferenças não é uma vantagem, é um risco. Cada um desses possuem funcionalidades específicas que podem ajudar bastante seu sistema. O PostgreSQL por exemplo fornece um módulo free de geolocalização.

Algumas vezes as coisas não vão bem e problemas surgem causados por questões específicas na tecnologia que você está usando e não conhecer sua ferramenta vai tornar seu trabalho de diagnóstico e correção muito mais complicado. Portanto, limitar-se a conhecer apenas seu framework de persistência sem conhecer o que há por baixo também é um passo fácil para fracassar.

## Não saber como usar índices

Um dos conceitos fundamentais de bancos de dados, não apenas os relacionais. Qualquer volume significante de dados persistidos demanda uma forma de indexá-los para que o acesso a eles seja mais eficiente, sua falta vai tornar suas queries um terror de lentas e tende a piorar quanto mais dados você tem. Os bancos fazem muitas coisas por si só, mas não conseguem identificar, a priori, quais dos atributos das suas entidades se beneficiariam mais pelo uso de um índice, pois é uma questão totalmente dependente do tipo de problema que você quer resolver. Esse passo vem fácil se você seguiu o passo anterior de limitar-se ao uso de um framework de ORM.
Não conhecer o problema N+1

Esse é um problema que necessita uma explicação mais extensa, por isso deixo aqui [uma muito boa feita pelos usuários do StackOverflow](https://pt.stackoverflow.com/questions/307264/o-que-%C3%A9-o-problema-das-queries-n1). Esse é um passo ao fracasso fácil de ser dado pois tudo que você precisa pra cometê-lo é adicionar uma linha ao seu mapeamento e de repente os tempos de consulta ao seu banco explodem. Algumas vezes até desnecessariamente, pois os frameworks ORM tem o hábito feio de por padrão carregar tudo ao que suas entidades se relacionam. Não estar atento a esses comportamentos vai te causar problemas de carregamento cíclicos, execuções lentas e bastante dor de cabeça quando isso acontece inesperadamente no seu ambiente de produção.

## Migrar para NoSQL

Se você deu todos os passos anteriores, você terá um sistema bem mais complexo, lento e que entra em crises frequentemente e agora você terá que ser esperto o suficiente para resolver os problemas que você não foi esperto o suficiente pra perceber que estava causando.

Você pode querer colocar a culpa no banco de dados, talvez até propagar o mito de que todo mundo sabe que bancos relacionais são lentos e não escalam e a solução é migrar para um banco não relacional, tipo o MongoDB. Agora você chegou ao seu destino do fracasso completo: você mudou de uma situação em que você não conhecia o mínimo necessário da tecnologia que estava usando para outra que conhece menos ainda, com o agravante que elas costumam ser soluções menos maduras, mais limitadas em funcionalidade que talvez você precisasse e que dificilmente serão mais apropriadas para sua aplicação.

Nada contra bancos NoSQL, eles tem suas utilidades e cenários que são mais vantajosos, mas eles não se propõem a substituir totalmente os bancos relacionais. Dentre os motivos pra se usar essa tecnologia, “SQL é lento e NoSQL é mais rápido” não é um deles, além de ser falso e talvez irrelevante, suas ineficiências podem muito bem residir em outro lugar.

## Conclusão

Infelizmente, por vários fatores, muitos desenvolvedores não possuem o conhecimento que eu julgo básico no tratamento de bancos de dados. Desenvolvedores bons são também bons designers de tabelas, bons elaboradores de queries e bons entendedores dos conceitos fundamentais de bancos SQL e isso tudo acaba se tornando um diferencial. Caso algum dos passos tenha se aplicado a você, não se sinta ofendido, esse artigo foi apenas uma brincadeira invertendo o usual "X passos para fazer Y bem" mas sua essência não deixa de ser verdadeira. Com esses passos você pode identificar lacunas no seu conhecimento e começar a trabalhar no aprofundamento desses conceitos. Uma busca online dos termos mencionados aqui já é um começo que muita gente ainda não fez. Vá lá e bom aprendizado.