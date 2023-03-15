# Nest.js チュートリアル
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
# modules
- 大きく2種類ある
  1. app.modules.ts
    - 全てのモジュールはここに追記していく(以下で説明する機能ごとのmodulesのことである)
  2. 機能ごとのmodules.ts
    - 上記の生成コマンドを用いて作成した機能単位のmoduleであり主に機能単位のControllerとServiceを紐つけていく
# controllers
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
# services
- 具体的なビジネスロジックを実装する
```ts
@Injectable()
export class ItemsService {
  findAll() {
    return 'This is ItemServices';
  }
}
```
## 解説
- デコレータは@Injectable()

## controllerからserviceを利用する方法
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
