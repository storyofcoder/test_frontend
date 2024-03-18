import styled from 'styled-components'

import HolidayOrnament from './HolidayOrnament'

// ESLint reports `fill` is missing, whereas it exists on an SVGProps type
type SVGProps = React.SVGProps<SVGSVGElement> & {
  fill?: string
  height?: string | number
  width?: string | number
  gradientId?: string
}

export const UniIcon = (props: SVGProps) => (
  <Container>
   <img
                src={"./images/logos/logo.svg"}
                alt={'main-logo'}
                width="30px"
                height="30px"
                style={{
                  // borderRadius: '60px',
                  objectFit: 'cover',
                }}
              />
    <HolidayOrnament />
  </Container>
)

const Container = styled.div`
  position: relative;
`
