Funcionalidade: Entidade Item
  Como um administrador do sistema
  Eu quero gerenciar itens no inventário
  Para garantir a integridade dos dados e informações válidas dos itens

  Contexto:
    Dado um item válido com as seguintes propriedades:
      | propriedade | valor                                      |
      | nome        | Big Mac                                    |
      | descrição   | Delicioso hambúrguer com molho especial   |
      | imagens     | ["image1.jpg", "image2.jpg"]              |
      | quantidade  | 10                                         |
      | preço       | 25.99                                      |
      | categoria   | SANDWICH                                   |

  Cenário: Criar um item com propriedades válidas
    Quando eu criar um novo item com propriedades válidas
    Então o item deve ser criado com sucesso
    E o item deve ter todas as propriedades fornecidas
    E o item deve ter createdAt como uma instância de Date
    E o item deve ter updatedAt como uma instância de Date
    E o item deve ter isDeleted como false
    E o item deve ter id como undefined

  Cenário: Criar um item com id, datas e status de exclusão fornecidos
    Dado um id de item "test-id"
    E uma data createdAt "2023-01-01"
    E uma data updatedAt "2023-01-02"
    E status isDeleted como true
    Quando eu criar um novo item com essas propriedades adicionais
    Então o item deve ter id como "test-id"
    E o item deve ter createdAt como "2023-01-01"
    E o item deve ter updatedAt como "2023-01-02"
    E o item deve ter isDeleted como true

  Esquema do Cenário: Validar nome do item - casos inválidos
    Quando eu tentar criar um item com nome "<nome>"
    Então o sistema deve lançar uma BaseException
    E a mensagem de erro deve ser "<mensagem_erro>"
    E o código de erro deve ser "ITEM_NAME_EMPTY"
    E o código de status deve ser 400

    Exemplos:
      | nome              | mensagem_erro            |
      | string vazia      | Name cannot be empty     |
      | espaços em branco | Name cannot be empty     |
      | null              | Name cannot be empty     |
      | undefined         | Name cannot be empty     |

  Cenário: Atualizar nome do item com valor válido
    Dado um item existente
    Quando eu atualizar o nome do item para "Novo Nome do Item"
    Então o nome do item deve ser "Novo Nome do Item"

  Esquema do Cenário: Validar descrição do item - casos inválidos
    Quando eu tentar criar um item com descrição "<descrição>"
    Então o sistema deve lançar uma BaseException
    E a mensagem de erro deve ser "<mensagem_erro>"
    E o código de erro deve ser "ITEM_DESCRIPTION_EMPTY"
    E o código de status deve ser 400

    Exemplos:
      | descrição         | mensagem_erro                |
      | string vazia      | Description cannot be empty  |
      | espaços em branco | Description cannot be empty  |
      | null              | Description cannot be empty  |
      | undefined         | Description cannot be empty  |

  Cenário: Atualizar descrição do item com valor válido
    Dado um item existente
    Quando eu atualizar a descrição do item para "Nova descrição"
    Então a descrição do item deve ser "Nova descrição"

  Esquema do Cenário: Validar imagens do item - casos inválidos
    Quando eu tentar criar um item com imagens "<imagens>"
    Então o sistema deve lançar uma BaseException
    E a mensagem de erro deve ser "Images must be a non-empty"
    E o código de erro deve ser "ITEM_IMAGES_INVALID"
    E o código de status deve ser 400

    Exemplos:
      | imagens      |
      | array vazio  |
      | não é array  |
      | null         |
      | undefined    |

  Cenário: Atualizar imagens do item com array válido
    Dado um item existente
    Quando eu atualizar as imagens do item para ["new-image1.jpg", "new-image2.jpg", "new-image3.jpg"]
    Então as imagens do item devem conter 3 imagens
    E as imagens do item devem ser ["new-image1.jpg", "new-image2.jpg", "new-image3.jpg"]

  Cenário: Criar item com uma única imagem
    Quando eu criar um item com imagens ["single-image.jpg"]
    Então o item deve ser criado com sucesso
    E as imagens do item devem ser ["single-image.jpg"]

  Esquema do Cenário: Validar preço do item - casos inválidos
    Quando eu tentar criar um item com preço <preço>
    Então o sistema deve lançar uma BaseException
    E a mensagem de erro deve ser "Price cannot be 0 or less"
    E o código de erro deve ser "ITEM_PRICE_INVALID"
    E o código de status deve ser 400

    Exemplos:
      | preço   |
      | 0       |
      | -10.50  |
      | -5      |

  Cenário: Atualizar preço do item com valor positivo válido
    Dado um item existente
    Quando eu atualizar o preço do item para 99.99
    Então o preço do item deve ser 99.99

  Cenário: Criar item com preço decimal
    Quando eu criar um item com preço 15.75
    Então o item deve ser criado com sucesso
    E o preço do item deve ser 15.75

  Esquema do Cenário: Validar quantidade do item - casos inválidos
    Quando eu tentar criar um item com quantidade <quantidade>
    Então o sistema deve lançar uma BaseException
    E a mensagem de erro deve ser "Quantity cannot be 0 or less"
    E o código de erro deve ser "ITEM_QUANTITY_INVALID"
    E o código de status deve ser 400

    Exemplos:
      | quantidade |
      | 0          |
      | -5         |
      | -1         |

  Cenário: Atualizar quantidade do item com valor positivo válido
    Dado um item existente
    Quando eu atualizar a quantidade do item para 100
    Então a quantidade do item deve ser 100

  Cenário: Reduzir quantidade do item com valor válido
    Dado um item com quantidade 20
    Quando eu reduzir a quantidade do item em 5
    Então a quantidade do item deve ser 15

  Cenário: Reduzir quantidade do item a zero
    Dado um item com quantidade 10
    Quando eu reduzir a quantidade do item em 10
    Então a quantidade do item deve ser 0

  Cenário: Tentar reduzir quantidade por mais do que disponível
    Dado um item com quantidade 5
    Quando eu tentar reduzir a quantidade do item em 10
    Então o sistema deve lançar uma BaseException
    E a mensagem de erro deve ser "Quantity cannot be less than current quantity"
    E o código de erro deve ser "ITEM_QUANTITY_INVALID"
    E o código de status deve ser 400

  Cenário: Tentar reduzir quantidade por valor negativo
    Dado um item existente
    Quando eu tentar reduzir a quantidade do item em -5
    Então o sistema deve lançar uma BaseException
    E a mensagem de erro deve ser "Quantity cannot be less than current quantity"
    E o código de erro deve ser "ITEM_QUANTITY_INVALID"
    E o código de status deve ser 400

  Cenário: Reduzir quantidade por zero
    Dado um item com quantidade 10
    Quando eu reduzir a quantidade do item em 0
    Então a quantidade do item deve permanecer 10

  Cenário: Criar item com categoria inválida
    Quando eu tentar criar um item com categoria "INVALID_CATEGORY"
    Então o sistema deve lançar uma BaseException
    E a mensagem de erro deve ser "Invalid category value"
    E o código de erro deve ser "ITEM_CATEGORY_INVALID"
    E o código de status deve ser 400

  Cenário: Criar itens com todas as categorias válidas
    Quando eu criar itens com cada categoria válida
    Então todos os itens devem ser criados com sucesso
    E cada item deve ter sua respectiva categoria

  Cenário: Atualizar categoria do item com valor enum válido
    Dado um item existente com categoria "SANDWICH"
    Quando eu atualizar a categoria do item para "DESSERT"
    Então a categoria do item deve ser "DESSERT"

  Cenário: Tentar definir updatedAt antes de createdAt
    Dado um item com createdAt "2023-01-02"
    Quando eu tentar definir updatedAt para "2023-01-01"
    Então o sistema deve lançar uma BaseException
    E a mensagem de erro deve ser "UpdatedAt cannot be before CreatedAt"
    E o código de erro deve ser "ITEM_UPDATED_AT_INVALID"
    E o código de status deve ser 400

  Cenário: Definir updatedAt igual a createdAt
    Dado um item com createdAt "2023-01-01"
    Quando eu definir updatedAt para "2023-01-01"
    Então a operação deve ter sucesso
    E o updatedAt do item deve ser "2023-01-01"

  Cenário: Definir updatedAt após createdAt
    Dado um item com createdAt "2023-01-01"
    Quando eu definir updatedAt para "2023-01-02"
    Então a operação deve ter sucesso
    E o updatedAt do item deve ser "2023-01-02"

  Cenário: Gerenciar ID do item
    Dado um item existente sem id
    Quando eu definir o id do item para "test-id-123"
    Então o id do item deve ser "test-id-123"

  Cenário: Definir ID do item como undefined
    Dado um item com id "some-id"
    Quando eu definir o id do item como undefined
    Então o id do item deve ser undefined

  Cenário: Gerenciar data createdAt
    Dado um item existente
    Quando eu definir o createdAt para "2023-06-15"
    Então o createdAt do item deve ser "2023-06-15"

  Cenário: Verificar propriedade isDeleted
    Quando eu criar um item com isDeleted como true
    Então o isDeleted do item deve ser true

  Cenário: Valor padrão de isDeleted
    Quando eu criar um item sem especificar isDeleted
    Então o isDeleted do item deve ser false

  Cenário: Manipular preço positivo muito pequeno
    Quando eu criar um item com preço 0.01
    Então o item deve ser criado com sucesso
    E o preço do item deve ser 0.01

  Cenário: Manipular preço muito grande
    Quando eu criar um item com preço 999999.99
    Então o item deve ser criado com sucesso
    E o preço do item deve ser 999999.99

  Cenário: Manipular quantidade muito grande
    Quando eu criar um item com quantidade 1000000
    Então o item deve ser criado com sucesso
    E a quantidade do item deve ser 1000000

  Cenário: Manipular múltiplas imagens
    Quando eu criar um item com 10 imagens
    Então o item deve ser criado com sucesso
    E o item deve ter 10 imagens

  Cenário: Manipular nome e descrição muito longos
    Quando eu criar um item com nome de 1000 caracteres
    E descrição de 1000 caracteres
    Então o item deve ser criado com sucesso
    E o nome do item deve ter 1000 caracteres
    E a descrição do item deve ter 1000 caracteres

  Cenário: Manipular updateItemQuantity com valores decimais
    Dado um item com quantidade 10.5
    Quando eu reduzir a quantidade do item em 5.2
    Então a quantidade do item deve ser aproximadamente 5.3
