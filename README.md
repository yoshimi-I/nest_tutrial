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
# 3. DBに格納する方法
1. まずは格納するitemのInterfaceを同じmoduleディレクトリに作成する(今回ならitems)
- また今回はenumを用いている
  ```ts
  export interface Item {
    id: string;
    name: string;
    price: number;
    description: string;
    status: ItemStatus;
  }

2. CRUD操作のCreate参照
# 4. CRUD操作の実装
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
