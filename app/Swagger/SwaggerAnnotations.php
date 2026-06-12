<?php

/**
 * @OA\Info(
 *     title="API Ventas System",
 *     version="1.0.0",
 *     description="API para sistema de ventas",
 *     @OA\Contact(
 *         email="tu@email.com",
 *         name="Soporte"
 *     )
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Servidor Local"
 * )
 *
 * @OA\PathItem(
 *     path="/api"
 * )
 *
 * @OA\Components(
 *     @OA\SecurityScheme(
 *         securityScheme="bearerAuth",
 *         type="http",
 *         scheme="bearer"
 *     )
 * )
 */
class SwaggerAnnotations
{
    //
}
