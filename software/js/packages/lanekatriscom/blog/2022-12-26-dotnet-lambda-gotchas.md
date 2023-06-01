# .NET Lambda Gotchas

Be careful not to reference projects with extranneous packages... You'll get errors in lambda but you'll finish successfully. You'll get dll load erros.

I fixed by moving pocos and marten to a class library and just refernced that and now i'm' good

Sometimes you'll get no errors, bump you ram and cpu
