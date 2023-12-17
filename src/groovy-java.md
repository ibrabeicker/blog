---
outline: deep
---

# Usando scripts Groovy no Java

No post anterior vimos as vantagens de agregar o poder e expressividade de scripts nas nossas aplicações e agora vamos explorar a fundo como fazemos essa integração com scripts escritos em Groovy em uma aplicação Java.

## O que é o Groovy

Groovy é uma linguagem de programação que assim como o Java roda na JVM e foi criada com a proposta de aumentar a produtividade e satisfação dos desenvolvedores. Ele é dinâmico, opcionalmente tipado, oferece várias syntax-sugar (firula sintática, por minha tradução) e várias evoluções em relação ao Java que nos permitem escrever menos e nos expressarmos mais.

## Primeiros passos

O primeiro passo para fazer esse casamento entre Groovy e Java é importar a biblioteca. No nosso arquivo Gradle ou Maven adicionamos:

```groovy
implementation 'org.codehaus.groovy:groovy-all:3.0.9'
```

Pronto, nosso projeto já está apto a rodar os scripts Groovy. Um exemplo básico para executar um código é o seguinte:

```groovy
Object result = Eval.me("3 + 4 * 5");
```

Esse código avalia dinamicamente a expressão passada na forma de string, obtendo como resultado um Integer com valor 23. Caso algum dos números fosse expresso na forma decimal (3.0 por exemplo) toda a conta seria convertida para operações com os tipos BigDecimal e é nesses casos que temos que ficar atentos a natureza dinâmica do Groovy

## Passando valores para o script

A integração com o Groovy não está limitada a executar apenas strings. É possível criar um script que use variáveis, e a atribuição é feita pela nossa aplicação. Vamos criar um exemplo de um script Groovy que calcule para nós o teorema de Pitágoras, sendo a e b os comprimentos dos catetos e c o comprimento da hipotenusa.

```groovy
if (a && b)
    return Math.sqrt(a * a + b * b)
def cat = a == null ? b : a
return Math.sqrt(c * c - cat * cat)
```

Ele funciona da seguinte forma: se passarmos os valores dos dois catetos ele calcula a hipotenusa, se passarmos a hipotenusa e apenas um cateto ele calculará o cateto faltante. O código Java para executar o script acima é o seguinte:

```java
GroovyShell groovyShell = new GroovyShell();
Script script = groovyShell.parse("if (a && b)\n" +
    "    return Math.sqrt(a * a + b * b)\n" +
    "def cat = a == null ? b : a\n" +
    "return Math.sqrt(c * c - cat * cat)");
Binding binding = new Binding();
binding.setVariable("a", 3.0);
binding.setVariable("b", 4.0);
binding.setVariable("c", null);
script.setBinding(binding);
Object result = script.run();
```

Na primeira linha temos um objeto novo do Groovy, o GroovyShell. Ele tem várias vantagens como armazenar um código já compilado e permitir uma configuração bastante detalhada sobre o que pode ser usado no script, que exploraremos mais a frente. Na linha 6 criamos o objeto Binding que armazenará os valores das variáveis que desejamos passar para o Groovy. Na linha seguinte atribuímos esse objeto para ser usado no script e rodando com o método run(), obtendo como resultado o BigDecimal 5.0. Para usar o script novamente com outros valores de variáveis é só criar outro Binding e atribuir ao script.

## Chamando o que está no Java pelo Groovy

A integração não vai apenas na direção do Java chamar o Groovy. Como ambos estão na JVM o Groovy tem acesso a praticamente tudo que está disponível no Java, as classes do seu projeto inclusive. A única coisa que você precisa fazer é declarar a importação. Quando estamos trabalhando com um framework tipo o Spring, importar uma classe de sistema não é tão útil quanto ter acesso a um componente gerenciado, que é um objeto como qualquer outro.

Para permitir que dentro do script Groovy possamos chamar os comportamentos desejados do resto da nossa aplicação podemos colocar dentro do Binding o nosso componente. Por exemplo:

```java
@Autowired
private EmailService emailService

public void setScript() {    
    Binding binding = new Binding();
    binding.setVariable("emailService", emailService);
    //...
}
```

Nesse momento dentro do Groovy podemos chamar os métodos do EmailService e obter seus resultados normalmente.

```groovy
def success = emailService.sendEmail(emailAddress, message)
```

## O que vem depois

Como mostrado aqui o Groovy tem grande utilidade para uso nos scripts, mas ele foi elaborado como uma linguagem de programação completa. Nele podemos criar classes, parsear XML e JSON, projetar linguagens de domínio específico (DSL) e muito mais, tudo acessível pelos mecanismos mostrados nesse artigo. Vale uma leitura rápida da documentação da linguagem para saber tudo do que ele é capaz.

### Performance

Anteriormente substituímos a chamada do Eval pela criação de um GroovyShell. Um dos benefícios dessa abordagem é que a chamada ao parse do shell retorna um objeto Script que podemos reaproveitar em outras chamadas e melhorando a performance da execução do Groovy.

Para termos uma ideia da diferença de custo das duas abordagens, abaixo mostro os tempos de execução de cada um dos métodos.

### Eval

```
10:53:20.349 [Test worker] Eval took 368 ms
10:53:52.212 [Test worker] Loop took 31858 ms
10:53:52.214 [Test worker] Eval took 2 ms
```

### Script Parse

```
10:57:07.199 [Test worker] Parse took 460 ms
10:57:07.204 [Test worker] Run took 1 ms
10:57:07.206 [Test worker] Loop took 2 ms
10:57:07.206 [Test worker] Run took 0 ms
```

Em ambos os testes fazemos a execução de um código com uma fórmula matemática simples e medimos o tempo para essa primeira chamada. Depois chamamos o mesmo método mais 10 mil vezes e registramos o tempo e por fim medimos uma última execução. Todo esse loop é feito para que os processos de otimização da JVM tenham tido tempo para serem aplicados e termos uma noção mais precisa da real performance ao longo de um período mais longo. (Em um post futuro vamos explorar os motivos pelos quais a máquina virtual do Java tem as primeiras execuções muito mais lentas e como execuções repetidas melhoram esse cenário).

Podemos ver que a primeira execução do parse demorou um pouco mais que a primeira execução do Eval, mas logo em seguida ele dispara na frente, fazendo o mesmo trabalho 15 mil vezes mais rápido. Isso se deve ao fato que para cada chamado do Eval a biblioteca do Groovy precisa fazer a interpretação sintática do código que estamos passando e transformá-lo em bytecode Java para ser executado pela JVM, um processo notoriamente custoso não só para o Groovy mas para todas as linguagens de programação. Já no método do parse mantemos o resultado dessa interpretação em um objeto e poupamos todo esse trabalho, resultando num tempo de execução muito mais rápido.

Em um cenário de uso real em que requisições podem chegar a qualquer momento, se quisermos poupar o trabalho de interpretação do código a cada chamada podemos manter o Script retornado pelo método parse() em algum tipo de cache.

### Multithread

O Binding, como explicado na documentação, não é thread-safe e por isso acessos concorrentes a esse objeto podem causar comportamentos inconsistentes. Se você seguiu a abordagem anterior de manter o objeto Script cacheado, deve se preocupar com esse fato. Uma forma fácil de lidar com isso é adicionar synchronized ao método que lida com esses objetos.

Outra forma mais engenhosa, porém mais complicada, é transformar o Script em uma classe stateless que não depende do Binding para executar. Através do GroovyClassLoader podemos transformar o código do nosso script em uma classe como qualquer outra e se fizermos ele declarar que implementa uma interface definida no nosso código Java podemos fazer com que a aplicação interaja com o script de forma fortemente tipada.

Por exemplo podemos ter uma interface num arquivo .java que define a forma como queremos interagir com o script

```java
public interface AppInterface {
    BigDecimal pythagoras(BigDecimal a, BigDecimal b, BigDecimal c);
}
```

O Script que vamos executar então importa tal interface e declara uma classe implementando ela.

```java
import com.pensarcomodev.script.AppInterface

class PythagoreanTheorem implements AppInterface {

    BigDecimal pythagoras(BigDecimal a, BigDecimal b, BigDecimal c) {
        if (a && b)
            return Math.sqrt(a * a + b * b)
        def cat = a == null ? b : a
        return Math.sqrt(c * c - cat * cat)
     }
}
```

Agora a forma de ler e parsear o script fica um pouco diferente. Na classe Java que carregará o script fazemos:

```java
public BigDecimal calculatePythagoras() throws Exception {
    GroovyClassLoader groovyClassLoader = new GroovyClassLoader();
    Class aClass = groovyClassLoader.parseClass(code);
    AppInterface script = (AppInterface) aClass.getDeclaredConstructor().newInstance();
    return script.pythagoras(BigDecimal.valueOf(3), BigDecimal.valueOf(4), null);
}
```

### Segurança

Pode ser que você deseje disponibilizar para seus usuários a possibilidade deles mesmos adicionarem alguns pedaços de script para serem executados na sua aplicação e nisso surgem uma série de considerações a serem feitas no quesito segurança. Um usuário malicioso pode escrever um loop infinito e fará com que a sua aplicação fique presa em um loop, ou por ter acesso a tudo que o Java teria ele pode importar as bibliotecas File e acessar os arquivos do servidor, ou então chamar System.exit(0) e matar seu processo. Como nenhuma restrição foi feita o Java vai executar alegremente essas instruções e causar problemas sérios.

O Groovy já foi pensado como um mecanismo para scripts e por isso ele nos dá meios robustos de definir o que pode ser feito através dele. Abaixo há um exemplo do que podemos configurar:

```java
SecureASTCustomizer astCustomizer = new SecureASTCustomizer();
astCustomizer.setImportsWhitelist(Arrays.asList(
    Math.class.getCanonicalName(),
    Object.class.getCanonicalName(),
    ApplicationMethods.class.getCanonicalName()
));
astCustomizer.setStatementsBlacklist(Arrays.asList(
    WhileStatement.class,
    DoWhileStatement.class,
    ForStatement.class
));
astCustomizer.setAllowedReceivers(Arrays.asList(
    Object.class.getCanonicalName()
));
astCustomizer.setIndirectImportCheckEnabled(true);
CompilerConfiguration conf = new CompilerConfiguration();
conf.addCompilationCustomizers(astCustomizer);
return new GroovyShell(conf);
```

Podemos criar uma blacklist ou uma whitelist com os aspectos que permitiremos ao Groovy executar. Uma blacklist proíbe tudo que está incluso e permite todo o resto por padrão, já uma whitelist permite apenas o que está incluso na lista, proibindo por padrão todo o resto. Essa última forma por ser mais restritiva é mais segura e por isso está sendo usada aqui.

Aqui permitimos apenas o uso das classes Math, Object e ApplicationMethods, que é uma classe definida na nossa aplicação. Nada além dessas três classes pode ser usado e agora é impossível chamar System.exit() por exemplo, já que essa é uma chamada da classe proibida System.

Para evitar loops colocamos na blacklist os comandos de loop: while, do-while e for. Essas configurações básicas já proveem uma segurança adequada para maioria dos usos.

## Conclusão

A linguagem Groovy é quase que a candidata natural para se criar scripts para serem usados numa aplicação Java, a integração é fácil e pode trazer vários benefícios em configuração, comportamento e flexibilidade.