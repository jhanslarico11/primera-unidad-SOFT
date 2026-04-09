<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reporte de Stock de Productos</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        h1 {
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }

        .info {
            margin: 20px 0;
            color: #666;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th {
            background: #667eea;
            color: white;
            padding: 12px;
            font-weight: bold;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            color: #999;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <h1>📊 REPORTE DE STOCK DE PRODUCTOS</h1>

    <div class="info">
        <strong>Fecha de generación:</strong> {{ now()->format('d/m/Y H:i:s') }}<br>
        <strong>Total de productos:</strong> {{ count($products) }}<br>
        <strong>Stock total:</strong> {{ $products->sum('quantity') }} unidades
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Código de Barras</th>
                <th>Stock Actual</th>
                <th>Categoría</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($products as $index => $product)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td><strong>{{ $product->name }}</strong></td>
                <td>{{ $product->bar_code ?? 'N/A' }}</td>
                <td>{{ $product->quantity }}</td>
                <td>{{ $product->category?->name ?? 'Sin categoría' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="5" style="text-align: center;">No hay productos registrados</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Sistema de Ventas - Reporte generado automáticamente
    </div>
</body>
</html>
