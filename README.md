## サービス概要
今まで通ったことのある道を可視化して図鑑のように楽しんだり散歩に取り入れたい事のメモを付けられる、探索のサポートをテーマとしたサービスです。

## このサービスへの思い・作りたい理由
近場で普段バスや車で通る道を敢えて歩いてみたところ、行列が長いパン屋や変わった外装の建物、心地いい公園など、面白そうな場所をいくつか発見しました。
この経験から、周りを見渡して探索してみると思いがけない発見が多く潜んでいるんじゃないかと考え探索に興味が湧くようになりました。

散歩がてら行ったことの無い道を通ってみるだけでも探索はできます。
しかし、その時感じた事や次来た時にしたい事を記録したり、図鑑を埋めるように通ったルートを可視化できる機能があればより充実した探索ができると思いましたが、現在の散歩アプリやgoogle mapではそのような機能が不足しているため、自分で探索をサポートするアプリを作ろうと思いました。

## ユーザー層について
- 新しい発見をしたい人
  - 土地勘を深めたい

- メモ用途として使いたい人
  - 例. 次回同じ飲食店に入った時に頼みたいもの
  - 他に行ってみたいルートが見つかった時

## サービスの利用イメージ
レスポンシブ対応を実装して、外で利用する事が多いアプリですのでスマホをメインに利用してもらう想定です。

- 他のユーザーが共有したスポットがマップ上に表示されるので、興味があるものは「行ってみたいリスト」に登録する
- 散歩が終了した際にポップアップでお気に入りのスポットがあれば登録（写真添付可）してもらうようにする
- 行きたいルートができた場合も事前にルートを設定できるようにする

散歩ルートの保存はスタート地点、中間地点（折り返しやルート検索時の補正のため）、ゴール地点を指定してもらい、ルート検索をして正しいルートをユーザーが選択して保存する流れにする予定です。
（Roads APIではマップ上に線を書いてルートを作成できるとのことなので、そちらも利用できればと思います。）

本リリースでの予定ですが、現在地の取得を利用して手間を減らせるようにしたいです。

## ユーザーの獲得について
- 良かったと思ったスポットをSNSで共有してもらう事で拡散をしてもらう


## サービスの差別化ポイント・推しポイント
1. ウォーキングアプリ
歩数を計測するといった健康目的が主なテーマに対して、このアプリでは街の探索をテーマとしています。

2. Google map
リストで現地のスポットと併せてコメントを残すことはできますが、リストを登録したメンバーしか見ることができません。
また、このサービスではコメントの他に写真を添付できるようにして差別化を図っています。

またGoogle mapにはタイムラインという機能がありますが、こちらは日毎のルートや訪問した場所を振り返る機能になっているため探索には適しておりませんでした。

## 機能候補
**MVPリリース**
- ユーザー登録機能
- ログイン機能
- 探索したルートの保存
- マップの表示（閲覧は未ログインでも可）

**本リリース**
- Xでのお気に入りルート等のシェア
- 行ってみたいリストの作成
- 行ってみたいルートの作成
- お気に入りスポットのCRUD機能
- 探索ルートを特定するための現在地の取得
- マップを縮小、拡大した際の表示方法の変化

## 機能の実装方針予定
ルートの作成、表示用にGoogle MapsのRoads APIを使用します。

## 画面遷移図
Figma：https://www.figma.com/design/PkVE1NMV5eKufo8jTMuWX0/%E5%87%BA%E4%BC%9A%E3%81%84%E6%97%85?node-id=0-1&t=eVsh6LW19WkpwOjt-1

## ER図
https://drive.google.com/file/d/1KN3SMF4wHev2RbSZUJWRfboJbVhChBcN/view?usp=sharing

[![Image from Gyazo](https://i.gyazo.com/c437ecef8bcde7297ad2467b54da1fa4.png)](https://gyazo.com/c437ecef8bcde7297ad2467b54da1fa4)