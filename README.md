# Nest.js チュートリアル
# 1. よく使うコマンド
- 以下に基本操作をまとめる

## 起動コマンド
```zsh
npm run start:dev
```
- devをつけることで動的に開発可能
## 生成コマンド
### 1. Modules生成コマンド
```zsh
nest g module モジュール名
```
- gはジェネレータのgである

### 2. Controller生成コマンド
```zsh
nest g controller モジュール名
```
- このコードによりコントローラをモジュールに紐づける
### 3. Services生成コマンド
```zsh
nest g service モジュール名
```
# 2. 大まかな仕組み
- 基本的にmodulesとcontrollersとservicesを用いて開発を行なっていく
## modules
- 大きく2種類ある
  1. app.modules.ts
    - 全てのモジュールはここに追記していく(以下で説明する機能ごとのmodulesのことである)
  2. 機能ごとのmodules.ts
    - 上記の生成コマンドを用いて作成した機能単位のmoduleであり主に機能単位のControllerとServiceを紐つけていく
## controllers
- 主な役割はルーティングの機能を持つ
- 以下はitemsのsrcを用いた場合の機能である
- Getメソッドとitemsを定義しており
[localhost:3000/items](localhost:3000/items)にアクセスするとfindAllメソッドが呼ばれる
```
@Controller('items')
export class ItemsController {
  @Get()
  findAll() {
    return 'Hello';
  }
}
```
## services
- 具体的なビジネスロジックを実装する
```ts
@Injectable()
export class ItemsService {
  findAll() {
    return 'This is ItemServices';
  }
}
```
- デコレータは@Injectable()

# controllerからserviceを利用する方法
### 1. ModuleのprovidersにServiceを登録する
  - 作成したモジュール名/作成したモジュール名.modules.ts
    ```ts
    @Module({
      controllers: [ItemsController],
      providers: [ここに追加],
    })
    export class ItemsModule {}
    ```
### 2. ControllerのconstructorでServiceを引数に取る
  - constructorはprivateのreadonlyでとる
  ```ts
  @Controller('items')
export class ItemsController {
  constructor(private readonly ItemsService: ItemsService) {}
  @Get()
  findAll() {
    return this.ItemsService.findAll();
  }
}
  ```

# 3. CRUD操作の実装
## 1. Createメソッドの実装
- 基本的にCreateはPostメソッドを用いて行うためbodyに値を入れ込む必要がある
- ここで**@Body**を用いる
```ts
  @Post()
  create(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description: string,
  ): Item {
    const item: Item = {
      id,
      name,
      price,
      description,
      status: ItemStatus.ON_SALE,
    };
    return this.ItemsService.create(item);
  }
}
```
### DTOの使用
- 上記のコードでは＠Bodyをつけて全てに値を代入しているがこれはDTO(DBに格納する型を指定したclass)を使用することでより簡単に書ける
- 名前は別にDTOでなくてもいいがclassを用いないとバリデーションができない(Interfaceだとまずい)
```ts
export class CreateItemDTO {
  id: string;
  name: string;
  price: number;
  description: string;
}
```
- controllerの書き換え
```ts
  @Post()
  create(@Body() CreateItemDto: CreateItemDTO): Item {
    return this.ItemsService.create(CreateItemDto);
  }
```
- serviceの書き換え
```ts
  create(CreateItemDTO: CreateItemDTO): Item {
    const item: Item = {
      ...CreateItemDTO,
      status: ItemStatus.ON_SALE,
    };
    this.items.push(item);
    return item;
  }
```
## 2. Readメソッドの実装
- 今回は主にidを引数にとると一致したidの商品を取得する処理を実装したいとする
- 今回はクエリパラメータを使いgetメソッドで取得する必要がある
- ここで今回は**@Param**を用いる
  ```ts
  @Get(':id')
    findById(@Param('id') id: string): Item {
      return this.ItemsService.findById(id);
    }
  ```
  - このように':id'とすることで可変長のパラメータと認識させることができ,また@Paramを用いることで引数に反映させる
  - servicesでの書き方は以下のようになっている
  ```ts
  findById(id: string): Item {
      return this.items.find((item) => item.id === id);
    }
  ```
## 3. Updateメソッドの実装
- 今回は主にidを引数にとると一致したidの商品をSoldOutに変更する処理を実装する
- 今回は更新処理のため**@Patch**を用いて実装する
  - Controller側の実装
  ```ts
    @Patch(':id')
    updateStatus(@Param('id') id: string): Item {
      return this.ItemsService.updateStatus(id);
    }
  ```
  - Services側の実装
  ```ts
    updateStatus(id: string): Item {
    const item = this.findById(id);
    item.status = ItemStatus.SOLD_OUT;
    return item;
  }
  ```
## 4. Deleteメソッドの実装
- idを指定して一致した商品を削除するメソッドを実装
- 今回は＠deleteを用いることで実装可能
  - Controller側の実装
  ```ts
    @Delete(':id')
    delete(@Param('id') id: string): void {
    this.ItemsService.delateStatus(id);
  }
  ```
  - Services側の実装
  ```ts
    delateStatus(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
  ```
# 4. バリデーションチェック
- 基本的には入力チェックのことを言う
- post通信を行うときに値が適切なものかの判断を行う
- また詳しい説明は[ここ](https://github.dev/typestack/class-validator)を参照
## 使用方法
- Nest.jsではPipeを用いる,使い方は大きく3つある
  1. ハンドラごとに利用する方法
  2. ボディのパラメータごとに利用する方法
  3. main.tsに使用することでアプリケーション全体に使用する方法
## インストール方法
- 今回はidにuuidを用いる
- uuidとはいつでも誰でも作れるけど、作ったIDは世界中で重複しないことになっているIDのことである
```zsh
npm install --save uuid
```
- またクラスバリデーションをインスト〜する方法は以下である
```zsh
npm install --save class-validator class-transformer
```
## 適応方法
### 1. パラメータへの適応方法
- 今回はパラメータに適応する
- 今回は@Paramの第二引数に適応する
  ```ts
    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string): Item {
      return this.ItemsService.findById(id);
    }
  ```
### 2. DTOへの適応方法
- DTOに適応する
- 1. まずはmain.tsを変更
  ```ts
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
  }
  bootstrap();
  ```
  - 2. 次にDTOを変更
    - 具体的はバリデーションは[ここ](https://github.dev/typestack/class-validator)を参照
    ```ts
    export class CreateItemDTO {
      @IsString()
      @IsNotEmpty()
      @MaxLength(40)
      name: string;

      @IsInt()
      @Min(1)
      @Type(() => Number)
      price: number;

      @IsString()
      @IsNotEmpty()
      description: string;
    }
    ```

# 5. 例外処理
- Nest.jsに対応する例外処理を使う
- 詳しくは[ここ](https://zenn.dev/kisihara_c/books/nest-officialdoc-jp/viewer/overview-excepitonfilters)を参照
- 基本的にはserviceに記載する
- 具体的な実装方法は以下のようにする
  ```ts
  findById(id: string): Item {
      const canFind = this.items.find((item) => item.id === id);
      if (!canFind) {
        throw new NotFoundException();
      }
      return canFind;
    }
  ```
# 6. DB接続
## ORMの使い方
- オブジェクト指向とRDBの間を結びつけるもの
### メリット
- SQLを書かなくてもいい
- データの定義をEntityに書けばいいので安心である
-　またEntityはRepositoryで管理する
## Entityとは
- RDBと対応するオブジェクトを記載
- Entityデコレータを用いてクラスを定義していく

## Repositoryとは
- Entityを管理するためにある
- Entityと1対1となり,データベース操作を抽象化する
## Q. じゃあDTOとEntityの違いは何か
- A. これは簡単にいうとEntityはDBに格納する型を記載する役割を持ち,DTOはアプリケーション内のビジネスロジックの方を定義するときに使う

## ORMのインストール方法
- 今回はTypeORMを用いる
```sh
npm install --save @nestjs/typeorm typeorm pg
```
### TypeORMの使い方
1. app.module.tsを書き換える
```ts
@Module({
  imports: [
    ItemsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadEntities: true,
    }),
  ],
  controllers: [],
  providers: [],
})
```
- これはdocker-compose.ymlに設定したものである
- autoLoadEntitiesはtrueにすることで,EntityにtypeOrmの設定を毎度書かなくて済むわけである
