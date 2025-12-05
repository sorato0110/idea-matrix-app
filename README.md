# バンディット×ベイズ戦略

Impact × Cost で優先順位付けし、仮説検証とベイズ的な自信度更新まで 1 ページで行える SPA です。バックエンドなしでブラウザの `localStorage` のみを利用します。

## 使い方
1. `docs/index.html` をブラウザで開きます（GitHub Pages の `docs/` ディレクトリをそのまま公開できます）。
2. 上部タブで「戦略マップ / 仮説検証ボード / 自信度分析」を切り替えます。
3. 戦略マップで Impact / Cost を入力するとスコア計算と象限判定（Quick Wins など）が行われ、マトリクスにプロットされます。
4. 仮説検証ボードではステータス管理（Trial→Focus など）、リソース配分ゲージ、チャット風のクイックログを記録できます。合計リソースが 100% を超えると警告色になります。
5. 自信度分析では実験ログと KPI を残し、タグ（++/--）とスライダーで主観確率を更新できます。KPI ラベルはモーダルから編集可能です。

## 技術スタック
- React 18（esm.sh からの ESM インポート）
- TypeScript（Babel Standalone でブラウザトランスパイル）
- Tailwind CSS（CDN）
- lucide-react（アイコン）

## ファイル構成
- `docs/.nojekyll`: GitHub Pages の Jekyll ビルドを無効化するフラグ
- `docs/index.html`: Tailwind / importmap / Babel 設定とエントリーポイント
- `docs/types.ts`, `docs/constants.ts`, `docs/services/storage.ts`: 型・定数・ストレージユーティリティ
- `docs/components/*.tsx`: 各タブの UI コンポーネント
- `docs/App.tsx`, `docs/main.tsx`: ルートレイアウトとマウント
