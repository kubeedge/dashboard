import { useRouter } from "next/router"

const Logo = () => {
  const router = useRouter()
  return (
    <div
      style={{
        height: '48px',
        cursor: 'pointer'
      }}
      onClick={() => router.push('/')}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <img src="" alt="" />
        <h1 style={{
          height: '32px',
          margin: '0 0 0 12px',
          color: '#2F54EB',
          fontWeight: '600',
          fontSize: '18px',
          lineHeight: '32px'
        }}>kubuedge</h1>
      </div>
    </div >
  )
}

export default Logo