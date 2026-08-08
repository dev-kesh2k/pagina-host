import { useEffect } from 'react'
import { AlertTriangle, X, Trash2 } from 'lucide-react'

interface DeleteConfirmModalProps {
  open: boolean
  serviceTitle?: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmModal({
  open,
  serviceTitle,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="glass-card overflow-hidden rounded-3xl border-rose-500/20 shadow-2xl shadow-slate-950/50">
          <div className="flex items-start gap-4 px-6 pt-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-400/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-50">
                Excluir serviço
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Tem certeza que deseja excluir{' '}
                {serviceTitle ? (
                  <strong className="font-semibold text-slate-200">
                    "{serviceTitle}"
                  </strong>
                ) : (
                  'este serviço'
                )}
                ?
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/80 text-slate-400 transition-all hover:border-slate-600 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 px-6 pb-6">
            <p className="rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-400 ring-1 ring-inset ring-slate-800/80">
              Esta ação não pode ser desfeita. O serviço será removido do seu
              painel.
            </p>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-700/60 bg-slate-900/70 px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800/80 hover:text-slate-100 sm:flex-none"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:from-rose-400 hover:to-red-400 hover:shadow-rose-500/30 sm:flex-none"
              >
                <Trash2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
