interface props {
  link?: string
  txt?: string
  href?: string
}

export function ExtrnlLink(p: React.PropsWithChildren<props>) {
  const insides = p.txt ?? p.children
  
  return <a href={p.href ?? p.link} target="_blank" rel="noreferrer">{insides}</a>
}