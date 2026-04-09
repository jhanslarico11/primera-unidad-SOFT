<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Stock de Productos</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 40px;
            background: #f5f5f5;
        }

        .report-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header img {
            width: 80px;
            height: 80px;
            margin-bottom: 15px;
            border-radius: 50%;
            background: white;
            padding: 10px;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .header .date {
            font-size: 14px;
            opacity: 0.9;
        }

        .stats {
            display: flex;
            justify-content: space-around;
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e0e0e0;
        }

        .stat-card {
            text-align: center;
        }

        .stat-card .number {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
        }

        .stat-card .label {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
        }

        td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
            color: #333;
        }

        tbody tr:hover {
            background: #f8f9fa;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .badge-stock-low {
            background: #fee;
            color: #c62828;
        }

        .badge-stock-normal {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
        }

        @media (max-width: 768px) {
            body {
                padding: 20px;
            }
            th, td {
                padding: 8px;
                font-size: 12px;
            }
        }
    </style>
</head>

<body>
    <div class="report-container">
        <div class="header">
            <img src="{{ public_path('img/imagen-por-defecto.png') }}" alt="Logo">
            <h1>REPORTE DE STOCK DE PRODUCTOS</h1>
            <div class="date">Generado: {{ now()->format('d/m/Y H:i:s') }}</div>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="number">{{ count($products) }}</div>
                <div class="label">Total Productos</div>
            </div>
            <div class="stat-card">
                <div class="number">{{ $products->sum('quantity') }}</div>
                <div class="label">Total Stock</div>
            </div>
            <div class="stat-card">
                <div class="number">{{ $products->where('quantity', '<', 10)->count() }}</div>
                <div class="label">Stock Bajo</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Stock Actual</th>
                    <th>Categoría</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($products as $product)
                <tr>
                    <td>
                        <strong>{{ $product->name }}</strong>
                        @if($product->bar_code)
                            <br><small style="color: #999;">Código: {{ $product->bar_code }}</small>
                        @endif
                    </td>
                    <td>
                        <span class="badge {{ $product->quantity < 10 ? 'badge-stock-low' : 'badge-stock-normal' }}">
                            {{ $product->quantity }} unidades
                        </span>
                    </td>
                    <td>{{ $product->category?->name ?? 'Sin categoría' }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="3" style="text-align: center;">No hay productos registrados</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="footer">
            <p>© {{ date('Y') }} - Sistema de Ventas. Todos los derechos reservados.</p>
        </div>
    </div>
</body>

</html>
