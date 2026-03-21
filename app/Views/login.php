<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login - FuranchoFinder</title>
    <link rel="stylesheet" href="/assets/css/app.css?v=2">
</head>
<body>
    <div class="auth-wrap">
        <div class="auth-card">
            <div class="auth-title">FuranchoFinder</div>

            <?php if (session()->getFlashdata('error')): ?>
                <div class="auth-error"><?= esc((string) session()->getFlashdata('error')) ?></div>
            <?php endif; ?>

            <form method="post" action="/auth/login" class="auth-form">
                <label class="auth-label">
                    Email
                    <input class="auth-input" name="email" type="email" required autocomplete="username">
                </label>

                <label class="auth-label">
                    Contraseña
                    <input class="auth-input" name="password" type="password" required autocomplete="current-password">
                </label>

                <button class="auth-submit" type="submit">Entrar</button>

                <div class="auth-hint">Usuario de ejemplo: admin@furanchofinder.local / admin123</div>
            </form>
        </div>
    </div>
</body>
</html>
